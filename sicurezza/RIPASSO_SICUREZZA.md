# RIPASSO Cybersecurity — Prof. Bergadano (UniTo)

> Sintesi del programma d'esame. Esame scritto: **5 domande** (1 scelta multipla + 4 aperte), **45 minuti**.
> Copre anche i **metodi matematici** della crittografia, la **sicurezza di rete** e la **memory corruption** in profondità.
> Compagno delle flashcard, del puzzle e del mock.

---

## 1. Introduzione

- **CIA**: **C**onfidentiality (riservatezza — solo gli autorizzati accedono), **I**ntegrity (integrità — niente modifiche non autorizzate), **A**vailability (disponibilità — servizio accessibile con prestazioni garantite).
- **Computer Security** (dispositivi: intrusioni, malware, accessi fisici) vs **Communications Security** (comunicazione sulla rete).
- Attacchi a una comunicazione: **Interruption** (↯ disponibilità), **Interception/Eavesdropping** (↯ riservatezza), **Modification** (↯ integrità), **Fabrication** (↯ autenticità).
- **Passivo** (solo osserva: sniffing, traffic analysis) vs **attivo** (modifica/crea: spoofing, ARP poisoning).

## 2. Confidenzialità e cifrari

### 2.1 Crittografia simmetrica
- **Stessa chiave** per cifrare e decifrare (es. AES). Veloce. Problema: **distribuzione della chiave** e O(n²) chiavi per n utenti.
- **Cesare/sostituzione**: shift fisso → rotto con **analisi delle frequenze**. **Polialfabetici (Vigenère)**: più alfabeti, chiave ripetuta.
- **Vernam / one-time pad**: XOR con chiave **casuale, lunga quanto il messaggio, usata una sola volta** → **sicurezza perfetta**.
- **Modalità a blocchi**: **ECB** (ogni blocco indipendente → pattern visibili) vs **CBC** (XOR col cifrato precedente + IV → nasconde i pattern); anche **CFB/OFB** (stream).
- **Steganografia**: nasconde *l'esistenza* del messaggio (≠ crittografia che lo rende illeggibile).

### 2.2 Sistemi a chiave pubblica
- Coppia **pubblica/privata**: si cifra con la pubblica, si decifra con la privata → risolve la distribuzione delle chiavi.
- **RSA**: chiavi → primi `p,q`; `n=p·q`; `φ=(p-1)(q-1)`; `e` coprimo con φ; `d` = inverso moltiplicativo di e mod φ (Euclide esteso). Cifra `c=m^e mod n`, decifra `m=c^d mod n`. Sicurezza = **difficoltà di fattorizzare n**. Si usa l'**esponenziazione modulare veloce** (square-and-multiply).
- **Diffie-Hellman**: accordo su chiave condivisa su canale insicuro (si scambiano `g^a`, `g^b`; chiave comune `g^(ab)`). Sicurezza = **logaritmo discreto**.

## 3. Integrità

### 3.1 Hash resistenti alle collisioni
- Hash crittografica: input qualsiasi → digest fisso, **one-way**. Proprietà: resistenza a **preimmagine**, **seconda preimmagine**, **collisioni**; **effetto valanga**.
- **Collisione** = due input con stesso digest. **Paradosso del compleanno**: collisione in ~`2^(n/2)` → servono digest lunghi (es. 256 bit per 128 bit di sicurezza).

### 3.2 Autenticazione e firme digitali
- **Firma digitale**: si cifra l'**hash** del messaggio con la chiave **privata**; si verifica con la **pubblica**. Dà **integrità + autenticità + non ripudio**. Si firma l'hash (non il messaggio) per efficienza.
- **Distribuzione autenticata delle chiavi**: certificati firmati da una **CA** legano chiave pubblica ↔ identità (anti man-in-the-middle).

## 4. Sicurezza di rete e software

### 4.1 Sicurezza di rete
- **ISO/OSI** (7 livelli: Applicazione, Presentazione, Sessione, Trasporto, Rete, Collegamento, Fisico): ogni livello ha minacce/difese (IPSEC a Rete, TLS a Trasporto).
- **Sniffing**: intercettazione passiva; scheda in **modalità promiscua**. Facile con **hub** (tutti vedono tutto), difficile con **switch** (traffico per porta).
- **ARP poisoning/spoofing**: risposte ARP false → il MAC dell'attaccante è associato all'IP della vittima/gateway → **man-in-the-middle** e sniffing su switch.
- **Spoofing**: falsificare l'indirizzo sorgente (IP/MAC).
- **DoS** (saturare risorse → servizio indisponibile) vs **DDoS** (da molte macchine/botnet). Esempi: ICMP/ping flood, SYN flood, relay SMTP.

### 4.2 Software security (memory corruption)
- **Buffer overflow**: scrivere oltre il buffer (es. `gets()`), sovrascrivendo memoria adiacente sullo stack.
- **EIP rewriting**: l'overflow sovrascrive l'**indirizzo di ritorno**; al `return` si salta dove vuole l'attaccante. Indirizzi in **little-endian**.
- **Shellcode**: codice macchina (apre una shell) iniettato; l'EIP vi salta. Scritto in assembly per essere corto.
- **Code reuse** (return-to-libc / **ROP**): con stack non eseguibile si riusa codice esistente (es. `system("/bin/sh")`, gadget).
- **Privilege escalation**: da utente a **root** (es. binario **setuid** vulnerabile).
- **Protezioni**: **ASLR** (indirizzi casuali a ogni run), **stack canary** (valore di controllo tra variabili e indirizzo di ritorno; verificato al return), **NX/DEP** (stack non eseguibile → niente shellcode iniettato; separazione data/program space).

### 4.3 Firewall
- **Packet filter**: filtra per header (IP/porta/flag) con regole **ACL**; **stateless** (problemi con FTP; si guarda il flag **ACK**) vs **stateful** (traccia le connessioni). Regola anti-spoofing: scartare in ingresso IP sorgente interni.
- **Application proxy / application-aware**: analizza il contenuto a livello applicativo (più potente, più lento).
- **NAPT**: molti IP privati → 1 IP pubblico (per porta); nasconde la rete interna.

### 4.4 VPN — IPSEC
- **VPN**: tunnel cifrato/autenticato su rete pubblica. **IPSEC**: a livello IP, dà autenticazione/integrità/riservatezza.
- **AH** = autenticazione + integrità (**no** riservatezza). **ESP** = autenticazione + integrità + **riservatezza** (cifra); il più usato.
- **Transport mode**: protegge solo il payload (host-to-host). **Tunnel mode**: incapsula l'intero pacchetto IP in uno nuovo (gateway-to-gateway, VPN site-to-site).

### 4.5 Sicurezza applicativa web
- **SQL injection**: input non validato altera una query (`' OR '1'='1`). Difesa: **query parametrizzate**.
- **XSS (Cross-Site Scripting)**: script iniettato eseguito nel browser di altri utenti. **Reflected** (nella richiesta/URL) vs **Stored** (salvato sul server, colpisce tutti). Difesa: escaping/validazione output.
- **CSRF**: forza il browser autenticato della vittima a inviare richieste non volute. Difesa: token anti-CSRF.
- **OWASP**: cataloga le vulnerabilità web più critiche (Top 10): injection, XSS, autenticazione/sessione deboli, misconfigurazione, storage crittografico insicuro, redirect non validati, ecc.

---

### Trappole/Memo rapidi
- RSA → **fattorizzazione**; Diffie-Hellman → **logaritmo discreto**.
- **AH** non cifra; **ESP** sì.
- **NX** ferma lo shellcode iniettato → si passa a **ROP/return-to-libc**.
- **ASLR** randomizza, **canary** rileva, **NX** impedisce l'esecuzione: tre protezioni diverse.
- One-time pad sicuro **solo** se chiave casuale, lunga quanto il messaggio, usata una volta.
- Sniffing su **switch** ⇒ serve **ARP poisoning**.
