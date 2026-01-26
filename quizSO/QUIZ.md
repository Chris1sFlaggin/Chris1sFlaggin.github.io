📘 Capitolo 1: Introduzione e Strutture del Sistema (Domande 1-20)  
 * Qual è la definizione formale di Sistema Operativo fornita dal testo?  
   * Risposta: È un programma che agisce da intermediario tra l'utente e l'hardware, gestendo le risorse e fornendo un ambiente per l'esecuzione dei programmi in modo efficiente e sicuro.  
 * Perché il Sistema Operativo è definito "Allocatore di Risorse"?  
   * Risposta: Perché deve gestire e assegnare in modo equo e senza conflitti le risorse limitate del computer (CPU, memoria, spazio su disco, dispositivi I/O) tra i vari programmi e utenti.  
 * Cos'è il "Kernel" e in cosa differisce dai programmi di sistema?  
   * Risposta: Il kernel è l'unico programma sempre in esecuzione sul computer. I programmi di sistema sono software associati al SO ma non fanno parte del core, mentre i programmi applicativi sono quelli dell'utente.  
 * Descrivi il meccanismo di Interrupt (Interruzione).  
   * Risposta: È un segnale inviato dall'hardware o dal software alla CPU per segnalare un evento che richiede attenzione immediata. La CPU sospende il lavoro corrente e trasferisce l'esecuzione a una routine di servizio (Interrupt Service Routine).  
 * Cos'è il Vettore delle Interruzioni (Interrupt Vector)?  
   * Risposta: È una tabella di indirizzi di memoria che punta alle varie routine di gestione delle interruzioni, permettendo alla CPU di saltare rapidamente alla funzione corretta in base al tipo di segnale ricevuto.  
 * Spiega la differenza tra I/O sincrono e asincrono.  
   * Risposta: Nell'I/O sincrono il controllo torna all'utente solo al termine dell'operazione. In quello asincrono, il controllo torna immediatamente e il programma può fare altro mentre l'I/O prosegue.  
 * Cos'è l'accesso diretto alla memoria (DMA - Direct Memory Access)?  
   * Risposta: È una tecnica che permette a un dispositivo di I/O ad alta velocità di trasferire interi blocchi di dati direttamente da/verso la memoria principale senza l'intervento costante della CPU per ogni byte.  
 * Descrivi la gerarchia della memoria in base a velocità, costo e volatilità.  
   * Risposta: La gerarchia va dai Registri (più veloci/cari/piccoli) alla Cache, RAM, Disco a stato solido (SSD), Disco Rigido (HDD) e Nastri (più lenti/economici/grandi).  
       
 * Cos'è il Caching e perché è fondamentale?  
   * Risposta: È la copia di informazioni in una memoria più veloce (cache) per un accesso rapido. È fondamentale per mitigare il divario di velocità tra i componenti (es. tra CPU e RAM).  
 * Definisci il Multiprogramming (Multiprogrammazione).  
   * Risposta: È la capacità di tenere più processi in memoria contemporaneamente affinché la CPU abbia sempre un lavoro da eseguire, aumentando così l'utilizzo della CPU (CPU utilization).  
 * Cos'è il Time-Sharing (Smultitasking) e come si differenzia dalla multiprogrammazione?  
   * Risposta: È un'estensione logica della multiprogrammazione in cui la CPU commuta tra i processi così velocemente che gli utenti possono interagire con ogni programma durante l'esecuzione.  
 * Spiega il funzionamento del Dual-Mode (User mode vs Kernel mode).  
   * Risposta: L'hardware fornisce un bit di modalità (mode bit). In User Mode (1) l'accesso è limitato; in Kernel Mode (0) il SO ha il controllo totale. Serve a proteggere il sistema da utenti malintenzionati o errori.  
 * Cos'è una "Istruzione Privilegiata"?  
   * Risposta: Un'istruzione che può essere eseguita solo in Kernel Mode (es. disabilitare interruzioni, gestire la memoria, accedere all'I/O). Se eseguita in User Mode, causa un Trap.  
 * Cos'è il Program Counter (PC)?  
   * Risposta: Un registro che contiene l'indirizzo della prossima istruzione da eseguire per un determinato processo.  
 * Qual è la differenza tra un sistema monoprocessore e uno multiprocessore (Symmetric Multiprocessing - SMP)?  
   * Risposta: Nel monoprocessore c'è una sola CPU. Nell'SMP, più processori condividono la stessa memoria fisica e il sistema operativo, eseguendo compiti in parallelo.  
 * Cos'è un sistema Clustered?  
   * Risposta: Un insieme di sistemi separati (nodi) collegati tra loro che lavorano insieme, spesso condividendo lo storage, per fornire alta affidabilità e prestazioni.  
 * A cosa serve il Timer di sistema?  
   * Risposta: Serve a impedire che un programma utente monopolizzi la CPU. Alla scadenza del timer, viene generata un'interruzione che restituisce il controllo al SO.  
 * Cosa si intende per "Gestione della Memoria" nel Capitolo 1?  
   * Risposta: Il SO deve tracciare quali parti della memoria sono in uso, decidere quali processi caricare quando lo spazio è disponibile e allocare/deallocare spazio secondo necessità.  
 * Cos'è la Protezione e la Sicurezza (Protection vs Security)?  
   * Risposta: La protezione è il meccanismo per controllare l'accesso alle risorse interne; la sicurezza è la difesa del sistema contro attacchi esterni (virus, hacker).  
 * Definisci il concetto di "Sistema Operativo Real-Time".  
   * Risposta: Un sistema con vincoli temporali rigidi dove l'elaborazione deve essere completata entro scadenze precise (deadline), pena il fallimento del sistema.  
  
📘 Capitolo 2: Strutture del Sistema (Domande 21-40)  
21. Cosa sono le System Call e come vengono utilizzate da un programma?  
 * Risposta: Sono l'interfaccia di programmazione tra un processo e il sistema operativo. Generalmente non vengono chiamate direttamente, ma tramite API (Application Programming Interface) come POSIX (Linux) o Win32 (Windows).  
22. Descrivi il meccanismo di passaggio dei parametri alle System Call.  
 * Risposta: Esistono tre metodi: 1) Tramite registri della CPU (veloce ma limitato); 2) Tramite un blocco o tabella in memoria, il cui indirizzo è passato in un registro; 3) Tramite lo stack (pila), dove i parametri vengono inseriti (pushed) dal programma e prelevati dal SO.  
23. Qual è la differenza tra Programmi di Sistema (System Programs) e System Call?  
 * Risposta: Le System Call sono funzioni di base del kernel. I Programmi di Sistema sono utility fornite con il SO (es. ls, cp, editor di testo) che utilizzano le system call per offrire un ambiente di sviluppo ed esecuzione all'utente.  
24. Elenca le 5 categorie principali di System Call.  
 * Risposta: 1) Controllo dei processi; 2) Manipolazione dei file; 3) Gestione dei dispositivi (I/O); 4) Mantenimento delle informazioni; 5) Comunicazioni.  
25. Cos'è l'interprete dei comandi (Shell) e dove risiede?  
 * Risposta: È un programma di sistema che legge e interpreta i comandi impartiti dall'utente. Può essere integrato nel kernel (raro) o essere un programma separato che viene avviato al login.  
26. Descrivi la struttura a Monolite (Monolithic Kernel).  
 * Risposta: Tutto il sistema operativo (scheduling, file system, gestione memoria) risiede in un unico grande spazio di indirizzamento nel kernel. È molto veloce per via dell'overhead ridotto, ma difficile da manutenere ed estendere.  
27. Cos'è la struttura a Strati (Layered Approach)?  
 * Risposta: Il SO è diviso in livelli. Il livello 0 è l'hardware, l'ultimo è l'interfaccia utente. Ogni livello usa solo i servizi del livello inferiore. È facile da debuggare ma difficile da progettare efficientemente.  
28. Spiega la filosofia del Microkernel.  
 * Risposta: Sposta il maggior numero possibile di servizi dal kernel allo "spazio utente" (user space). Il kernel gestisce solo la comunicazione minima, la memoria e lo scheduling. È molto sicuro e facile da estendere.  
29. Come comunicano i moduli in un sistema a Microkernel?  
 * Risposta: Tramite il Message Passing (scambio di messaggi). Se un programma vuole leggere un file, invia un messaggio al servizio file system attraverso il microkernel.  
30. Cosa sono i Moduli Caricabili (Loadable Kernel Modules - LKM)?  
 * Risposta: È l'approccio moderno (usato da Linux). Il kernel ha un core centrale e può caricare o scaricare moduli (es. driver, file system) a tempo di esecuzione senza dover riavviare il sistema.  
31. Cos'è un Sistema Ibrido?  
 * Risposta: Un sistema che combina diverse architetture per bilanciare prestazioni e modularità (es. macOS usa un mix di microkernel Mach e componenti monolitici BSD).  
32. A cosa serve il "System Boot" (Avvio del sistema)?  
 * Risposta: È il processo di caricamento del kernel in memoria. Inizia con un piccolo codice chiamato bootstrap program (nella ROM o EEPROM) che individua il kernel sul disco, lo carica e lo avvia.  
33. Qual è il ruolo dei Servizi del Sistema Operativo?  
 * Risposta: Fornire funzioni comuni agli utenti: esecuzione programmi, operazioni di I/O, manipolazione del file system, comunicazioni, rilevamento errori, allocazione risorse e protezione.  
34. Cos'è l'interfaccia GUI rispetto alla CLI?  
 * Risposta: La CLI (Command Line Interface) usa testo e tastiera; la GUI (Graphical User Interface) usa icone, finestre e dispositivi di puntamento. Entrambe servono a invocare i servizi del SO.  
35. Come viene gestito l'errore di una System Call?  
 * Risposta: Solitamente la chiamata restituisce un codice d'errore (es. -1) e scrive il dettaglio in una variabile globale (es. errno in C).  
36. Perché le API sono preferite alle System Call dirette?  
 * Risposta: Per la portabilità. Un programma scritto usando le API può essere compilato su diversi sistemi che supportano quell'interfaccia, senza conoscere i dettagli specifici del kernel sottostante.  
37. Cos'è la "System Call Interface"?  
 * Risposta: È lo strato che intercetta le chiamate alle API e invoca le corrispondenti funzioni nel kernel, gestendo una tabella di numeri identificativi per ogni system call.  
38. Qual è il vantaggio principale del Microkernel rispetto al Monolito?  
 * Risposta: La robustezza: se un servizio (es. il driver della stampante) crasha in spazio utente, il kernel continua a funzionare. Nel monolito, un errore in un driver può bloccare l'intero sistema.  
39. Cos'è il "Core Dump"?  
 * Risposta: Un file generato dal SO quando un processo fallisce, contenente lo stato della memoria del processo in quel momento per scopi di debugging.  
40. Qual è l'obiettivo principale dei sistemi Virtual Machine?  
 * Risposta: Emulare l'hardware di una macchina fisica per permettere l'esecuzione di più sistemi operativi contemporaneamente in modo isolato sullo stesso hardware.  
  
📘 Capitolo 3: Processi (Domande 41-60)  
41. Qual è la differenza formale tra Programma e Processo?  
 * Risposta: Il programma è un'entità passiva (un file eseguibile su disco); il processo è un'entità attiva, un programma in esecuzione che include il Program Counter, i registri della CPU e lo stack.  
42. Descrivi le sezioni di un processo in memoria (Stack, Heap, Data, Text).  
 * Risposta: 1) Text: il codice eseguibile; 2) Data: variabili globali e statiche; 3) Heap: memoria allocata dinamicamente durante il run-time; 4) Stack: dati temporanei (parametri di funzioni, indirizzi di ritorno, variabili locali).  
43. Quali sono i 5 stati principali di un processo?  
 * Risposta: 1) New (creazione); 2) Running (istruzioni in esecuzione); 3) Waiting (in attesa di un evento/IO); 4) Ready (pronto per essere assegnato alla CPU); 5) Terminated (fine esecuzione).  
44. Cos'è il Process Control Block (PCB)?  
 * Risposta: È la struttura dati nel kernel che contiene tutte le informazioni di un processo: stato, PC, registri, limiti di memoria, elenco dei file aperti e statistiche di scheduling.  
45. Cos'è il Context Switch (Cambio di contesto) e perché è considerato un costo (overhead)?  
 * Risposta: È il salvataggio dello stato del processo attuale e il caricamento di quello del nuovo processo. È un costo perché la CPU non compie lavoro utile per l'utente durante questa operazione.  
46. Spiega la differenza tra lo Scheduler a breve termine (CPU Scheduler) e a lungo termine (Job Scheduler).  
 * Risposta: Quello a breve termine sceglie quale processo eseguire tra quelli pronti (frequente); quello a lungo termine controlla il grado di multiprogrammazione decidendo quali processi portare dal disco alla memoria (meno frequente).  
47. Cos'è un processo "I/O-bound" rispetto a uno "CPU-bound"?  
 * Risposta: Un processo I/O-bound passa più tempo a fare I/O che calcoli (brevi raffiche di CPU); un processo CPU-bound usa la maggior parte del tempo per calcoli (lunghe raffiche di CPU).  
48. Descrivi il meccanismo di creazione dei processi: fork() e exec().  
 * Risposta: fork() crea un processo figlio che è una copia esatta del padre; exec() sostituisce lo spazio di memoria del processo con un nuovo programma.  
49. Cosa succede se un padre termina prima del figlio?  
 * Risposta: Il figlio diventa un processo Orfano (Orphan) e viene solitamente "adottato" dal processo radice (init o systemd).  
50. Cos'è un processo "Zombie"?  
 * Risposta: Un processo che è terminato ma la cui voce nel PCB rimane nella tabella dei processi finché il padre non esegue la chiamata wait().  
51. Qual è lo scopo della Comunicazione tra Processi (IPC)?  
 * Risposta: Permettere ai processi di scambiare dati e sincronizzarsi. Utile per la condivisione di informazioni, la velocità di calcolo (parallelismo) e la modularità.  
52. Confronta i due modelli di IPC: Memoria Condivisa (Shared Memory) e Scambio di Messaggi (Message Passing).  
 * Risposta: La memoria condivisa è più veloce (velocità della RAM) ma richiede sincronizzazione manuale; lo scambio di messaggi è più facile da implementare (specialmente in sistemi distribuiti) ma ha l'overhead delle system call.  
53. Nello scambio di messaggi, qual è la differenza tra comunicazione Diretta e Indiretta?  
 * Risposta: Nella Diretta, il mittente deve nominare esplicitamente il destinatario; nella Indiretta, i messaggi vengono inviati a "caselle postali" (mailboxes) o porte.  
54. Cosa si intende per comunicazione Sincrona (Blocking) e Asincrona (Non-blocking)?  
 * Risposta: Sincrona: il mittente/ricevente si blocca finché il messaggio non è inviato/ricevuto. Asincrona: il mittente invia e prosegue; il ricevente ottiene un messaggio o un valore nullo senza fermarsi.  
55. Cos'è il buffering nei sistemi di messaggistica (Capacità zero, limitata, illimitata)?  
 * Risposta: Zero: il mittente deve aspettare il ricevente (appuntamento); Limitata: coda di lunghezza n; Illimitata: il mittente non si blocca mai.  
56. Descrivi il concetto di Socket.  
 * Risposta: È un punto di terminazione (endpoint) per la comunicazione tra due processi attraverso una rete, identificato da una coppia Indirizzo IP e Numero di Porta.  
57. Cosa sono le RPC (Remote Procedure Calls)?  
 * Risposta: Permettono a un programma di eseguire una procedura su un altro computer come se fosse una chiamata locale, utilizzando "stubs" per gestire i dettagli della rete.  
58. Cos'è una Pipe ordinaria (anonima) e qual è il suo limite principale?  
 * Risposta: Permette la comunicazione unidirezionale tra due processi correlati (padre-figlio). Il limite è che non può essere usata tra processi non correlati.  
59. Cosa sono le Named Pipes (FIFO)?  
 * Risposta: Pipe che appaiono come file nel file system; permettono la comunicazione bidirezionale tra processi qualsiasi, anche senza legami di parentela.  
60. Perché lo scheduling dei processi è necessario?  
 * Risposta: Per massimizzare l'utilizzo della CPU (tenerla sempre occupata) e per garantire tempi di risposta rapidi agli utenti in un sistema multitasking.  
  
📘 Capitolo 4: Thread (Domande 61-80)  
61. Cos'è un Thread e in cosa differisce da un processo?  
 * Risposta: Un thread (o processo leggero) è l'unità base di utilizzo della CPU. Mentre un processo ha un proprio spazio di indirizzamento isolato, i thread dello stesso processo condividono il codice, i dati e le risorse del sistema operativo, ma hanno ciascuno il proprio Program Counter, i registri e lo stack.  
62. Quali sono i quattro vantaggi principali della programmazione multithread?  
 * Risposta: 1) Reattività (l'applicazione continua a rispondere anche se una parte è bloccata); 2) Condivisione delle risorse (più facile e veloce della IPC); 3) Economia (creare thread costa meno che creare processi); 4) Scalabilità (sfrutta meglio le architetture multiprocessore).  
63. Cosa condividono tra loro i thread appartenenti allo stesso processo?  
 * Risposta: Condividono la sezione del codice (text), la sezione dei dati (variabili globali) e le risorse del sistema operativo (come i file aperti e i segnali).  
64. Qual è la differenza tra Parallelismo e Concorrenza?  
 * Risposta: La concorrenza permette a più task di fare progressi (anche su una sola CPU tramite time-sharing). Il parallelismo permette l'esecuzione simultanea di più task (richiede più processori o core).  
65. Descrivi il Parallelismo dei Dati (Data Parallelism).  
 * Risposta: Distribuisce sottoinsiemi dello stesso dato su più core, eseguendo la stessa operazione su ogni core (es. sommare una matrice gigante).  
66. Descrivi il Parallelismo delle Mansioni (Task Parallelism).  
 * Risposta: Distribuisce thread diversi (mansioni diverse) su più core, dove ogni thread opera sugli stessi dati o su dati differenti.  
67. Cosa sono i Thread Utente (User Threads)?  
 * Risposta: Sono thread gestiti da librerie a livello utente senza il supporto diretto del kernel. Il kernel vede solo il processo e non i singoli thread.  
68. Cosa sono i Thread Kernel (Kernel Threads)?  
 * Risposta: Sono thread supportati e gestiti direttamente dal sistema operativo. Il kernel esegue lo scheduling dei singoli thread invece che dei processi.  
69. Descrivi il modello Many-to-One.  
 * Risposta: Molti thread utente sono mappati su un unico thread kernel. Se un thread utente esegue una system call bloccante, l'intero processo si blocca. Non sfrutta il multicore.  
70. Descrivi il modello One-to-One.  
 * Risposta: Ogni thread utente ha un corrispondente thread kernel. Offre massima concorrenza, ma la creazione di troppi thread può appesantire il sistema (overhead del kernel). È il modello usato da Linux e Windows.  
71. Descrivi il modello Many-to-Many.  
 * Risposta: Molti thread utente vengono multiplexati su un numero uguale o minore di thread kernel. Combina i vantaggi degli altri due modelli senza i loro limiti estremi.  
72. Cos'è una Libreria di Thread (Thread Library)?  
 * Risposta: Fornisce al programmatore un'API per la creazione e gestione dei thread. Esempi principali sono Pthreads (POSIX), Windows threads e Java threads.  
73. Spiega la differenza tra la creazione di thread asincrona e sincrona.  
 * Risposta: Asincrona: il padre crea il figlio e continua l'esecuzione. Sincrona (fork-join): il padre aspetta che tutti i figli terminino prima di riprendere.  
74. Cosa succede se un thread chiama la system call fork()?  
 * Risposta: Dipende dall'implementazione: alcune versioni duplicano tutti i thread del processo, altre duplicano solo il thread che ha chiamato la fork().  
75. Qual è lo scopo della system call exec() in un ambiente multithread?  
 * Risposta: Se un thread chiama exec(), il nuovo programma sostituirà l'intero processo, inclusi tutti gli altri thread esistenti.  
76. Cos'è la Cancellazione del Thread (Thread Cancellation) e quali sono i due tipi?  
 * Risposta: È il termine di un thread prima che sia completato. 1) Asincrona: termina il thread bersaglio immediatamente. 2) Differita (deferred): il thread bersaglio controlla periodicamente se deve terminare (punto di cancellazione).  
77. Cosa sono i Segnali (Signals) nei sistemi UNIX?  
 * Risposta: Sono notifiche inviate a un processo per comunicare che si è verificato un evento specifico. Possono essere sincroni (errori di memoria) o asincroni (pressione di Ctrl+C).  
78. Cos'è un Thread Pool e perché si usa?  
 * Risposta: È un insieme di thread creati all'avvio che aspettano lavoro in una coda. Evita il costo continuo di creazione/distruzione dei thread e limita il numero massimo di thread attivi.  
79. Cosa sono i Thread-Specific Data (Dati specifici del thread)?  
 * Risposta: Dati che appartengono esclusivamente a un determinato thread (non condivisi), utili quando il programmatore non ha controllo sulla creazione del thread (es. in un pool).  
80. Cos'è lo Scheduler Activations?  
 * Risposta: Un meccanismo di comunicazione tra il kernel e la libreria dei thread (tramite upcalls) per mantenere il numero corretto di thread kernel assegnati a un'applicazione.  
  
📘 Capitolo 5: Scheduling della CPU (Domande 81-100)  
81. Qual è l'obiettivo principale del multiprogramming in relazione alla CPU?  
 * Risposta: Massimizzare l'utilizzo della CPU (CPU utilization). L'idea è di avere sempre un processo in esecuzione per evitare che la CPU rimanga inattiva durante le operazioni di I/O degli altri processi.  
82. Cos'è il ciclo "CPU-I/O Burst Cycle"?  
 * Risposta: L'esecuzione di un processo consiste in un'alternanza di raffiche di calcolo (CPU burst) e raffiche di attesa per l'input/output (I/O burst). Lo scheduling avviene quando termina un CPU burst.  
83. Spiega la differenza tra Scheduling Preemptive (con diritto di prelazione) e Non-preemptive.  
 * Risposta: Nel Non-preemptive, un processo tiene la CPU finché non la rilascia volontariamente o termina. Nel Preemptive, il sistema operativo può interrompere un processo in esecuzione per assegnare la CPU a un altro (es. quando arriva un processo a priorità più alta).  
84. Qual è il ruolo del Dispatcher?  
 * Risposta: È il modulo che assegna materialmente il controllo della CPU al processo selezionato dallo scheduler. Si occupa del context switch, del passaggio alla modalità utente e del salto all'indirizzo corretto del programma.  
85. Definisci la "Dispatch Latency".  
 * Risposta: È il tempo impiegato dal dispatcher per fermare un processo e avviarne un altro. Deve essere il più piccolo possibile.  
86. Quali sono i 5 criteri principali per valutare un algoritmo di scheduling?  
 * Risposta: 1) CPU Utilization (massimizzare); 2) Throughput (n. processi completati nell'unità di tempo); 3) Turnaround Time (tempo totale dalla sottomissione alla fine); 4) Waiting Time (tempo passato nella ready queue); 5) Response Time (tempo dalla richiesta alla prima risposta).  
87. Descrivi l'algoritmo FCFS (First-Come, First-Served) e il suo principale difetto.  
 * Risposta: I processi sono serviti nell'ordine di arrivo. Il difetto principale è l'effetto convoglio (Convoy Effect): processi brevi devono aspettare dietro un processo molto lungo, aumentando il tempo medio di attesa.  
88. Come funziona l'algoritmo SJF (Shortest Job First)?  
 * Risposta: Assegna la CPU al processo che ha il prossimo CPU burst più breve. È l'algoritmo ottimale per minimizzare il tempo medio di attesa.  
89. Qual è la difficoltà principale nell'implementare SJF?  
 * Risposta: Non è possibile conoscere in anticipo la durata del prossimo CPU burst. Si può solo stimare usando una media esponenziale dei burst precedenti.  
90. Cos'è lo Shortest-Remaining-Time-First (SRTF)?  
 * Risposta: È la versione preemptive di SJF. Se arriva un nuovo processo con un burst residuo minore di quello corrente, la CPU viene riassegnata al nuovo arrivato.  
91. Descrivi lo Scheduling a Priorità e il problema della Starvation.  
 * Risposta: Ogni processo ha un numero (priorità). La CPU va al processo con priorità più alta. La Starvation avviene quando processi a bassa priorità non vengono mai eseguiti perché arrivano sempre processi a priorità più alta.  
92. Cos'è la tecnica dell'"Aging" (Invecchiamento)?  
 * Risposta: È la soluzione alla starvation: consiste nell'aumentare gradualmente la priorità dei processi che attendono nella ready queue da molto tempo.  
93. Come funziona l'algoritmo Round Robin (RR)?  
 * Risposta: È progettato per i sistemi time-sharing. Ogni processo riceve una piccola unità di tempo di CPU (time quantum). Allo scadere, il processo viene messo in coda e la CPU passa al successivo.  
94. Come influisce la dimensione del Time Quantum sulle prestazioni del Round Robin?  
 * Risposta: Se il quantum è troppo grande, RR diventa un FCFS. Se è troppo piccolo, l'overhead del context switch diventa eccessivo, rallentando il sistema.  
95. Descrivi le Multilevel Queue (Code a più livelli).  
 * Risposta: La ready queue è divisa in code separate (es. processi interattivi in primo piano e processi batch in background). Ogni coda può avere il suo algoritmo di scheduling specifico.  
96. Cosa differenzia le Multilevel Feedback Queues dalle code semplici?  
 * Risposta: Permettono ai processi di spostarsi tra le code. Se un processo usa troppa CPU viene spostato in una coda a priorità più bassa; se un processo aspetta troppo viene promosso in una a priorità più alta (aging).  
97. Cos'è l'Affinità del Processore (Processor Affinity)?  
 * Risposta: Nei sistemi multiprocessore, è la tendenza a mantenere un processo sulla stessa CPU per sfruttare i dati già presenti nella memoria cache di quel processore.  
98. Spiega la differenza tra Load Balancing "Push" e "Pull".  
 * Risposta: Push migration: un task specifico controlla il carico e "spinge" processi dalle CPU cariche a quelle scariche. Pull migration: una CPU inattiva "tira" un processo da una coda di una CPU occupata.  
99. Cos'è il Real-Time Scheduling "Hard" rispetto al "Soft"?  
 * Risposta: Nel Hard, i task devono assolutamente essere completati entro la loro deadline. Nel Soft, si garantisce solo la priorità ai task critici, ma senza garanzie assolute di scadenza.  
100. Definisci la Latenza di Interruzione (Interrupt Latency) nei sistemi Real-Time.  
 * Risposta: È l'intervallo di tempo dal momento in cui arriva un'interruzione a quando inizia l'esecuzione della routine di servizio corrispondente. Deve essere minima per garantire la reattività del sistema.  
  
📘 Capitolo 6: Sincronizzazione dei Processi (Domande 101-120)  
101. Cos'è una Race Condition (Corsa critica)?  
 * Risposta: È una situazione in cui più processi accedono e manipolano dati condivisi in modo concorrente, e l'esito finale dell'esecuzione dipende dall'ordine particolare in cui avvengono gli accessi.  
102. Definisci il problema della Sezione Critica.  
 * Risposta: È un segmento di codice in cui un processo modifica dati condivisi (variabili, tabelle, file). Il problema consiste nel progettare un protocollo che garantisca che nessun altro processo sia nella sua sezione critica mentre uno lo è già.  
103. Quali sono i tre requisiti fondamentali per una soluzione al problema della sezione critica?  
 * Risposta: 1) Mutua Esclusione (solo un processo alla volta); 2) Progresso (se nessuno è nella sezione critica, la decisione su chi entra non può essere rimandata all'infinito); 3) Attesa Limitata (un processo non deve aspettare per sempre l'ingresso).  
104. Spiega l'approccio dei "Kernel Preemptive" vs "Non-preemptive" per la sincronizzazione.  
 * Risposta: Un kernel non-preemptive evita race condition perché un processo non viene interrotto mentre è in modalità kernel. Un kernel preemptive è più difficile da progettare ma più reattivo, poiché permette interruzioni anche durante le operazioni di sistema.  
105. Cos'è la soluzione di Peterson?  
 * Risposta: È una soluzione classica basata su software per due processi. Utilizza due variabili condivise: un array flag (intenzione di entrare) e una variabile turn (a chi tocca). È limitata a due processi e richiede un'architettura di memoria specifica.  
106. Cosa si intende per supporto hardware alla sincronizzazione?  
 * Risposta: L'uso di istruzioni atomiche speciali fornite dalla CPU, come TestAndSet o CompareAndSwap, che permettono di leggere e modificare una variabile in un unico passo indivisibile.  
107. Cos'è l'Atomicità?  
 * Risposta: Una proprietà di un'operazione o di un insieme di istruzioni che garantisce che vengano eseguite come un'unica unità senza interruzioni. Se fallisce, non deve lasciare effetti parziali.  
108. Definisci il Mutex Lock.  
 * Risposta: È lo strumento di sincronizzazione più semplice. Un processo deve acquisire il lock (acquire()) prima di entrare nella sezione critica e rilasciarlo (release()) all'uscita. È basato su una variabile booleana.  
109. Cos'è lo Spinlock e quando è utile usarlo?  
 * Risposta: È un mutex lock in cui il processo "gira" in un ciclo continuo aspettando che il lock si liberi (busy waiting). È utile in sistemi multiprocessore se il tempo di attesa previsto è inferiore a quello di due context switch.  
110. Cos'è un Semaforo e qual è la sua struttura?  
 * Risposta: È una variabile intera a cui si accede solo tramite due operazioni atomiche: wait() (o P) e signal() (o V). Se il valore è \le 0, il processo chiamante si blocca.  
111. Differenza tra Semaforo Binario e Semaforo Counting.  
 * Risposta: Il binario (0 o 1) agisce come un mutex. Il counting può assumere qualsiasi valore intero e viene usato per gestire l'accesso a una risorsa con più istanze disponibili.  
112. Come si risolve il problema del "Busy Waiting" nei semafori?  
 * Risposta: Implementando una coda di attesa associata al semaforo. Invece di ciclare, il processo viene sospeso (stato waiting) e messo in una coda; viene poi risvegliato da un altro processo tramite l'operazione signal().  
113. Cos'è l'Inversione di Priorità (Priority Inversion)?  
 * Risposta: Si verifica quando un processo ad alta priorità deve aspettare una risorsa detenuta da uno a bassa priorità, che a sua volta è interrotto da uno a priorità media.  
114. Descrivi il protocollo di Ereditarietà della Priorità (Priority Inheritance).  
 * Risposta: È la soluzione all'inversione di priorità: il processo a bassa priorità che detiene il lock "eredita" temporaneamente la priorità alta del processo che lo sta aspettando, finché non rilascia la risorsa.  
115. Descrivi il problema del Produttore-Consumatore.  
 * Risposta: Un produttore inserisce dati in un buffer e un consumatore li preleva. La sincronizzazione deve impedire che il produttore inserisca in un buffer pieno o che il consumatore prelevi da un buffer vuoto.  
116. Descrivi il problema dei Lettori-Scrittori.  
 * Risposta: Più lettori possono leggere contemporaneamente, ma se uno scrittore sta modificando il dato, nessun altro (lettore o scrittore) può accedere. Esistono varianti che danno priorità ai lettori o agli scrittori.  
117. Descrivi il problema dei Cinque Filosofi.  
 * Risposta: Un problema classico che illustra i pericoli del deadlock e della starvation nell'allocazione di risorse multiple (bacchette) tra processi concorrenti.  
     
118. Cos'è un Monitor?  
 * Risposta: È un costrutto di sincronizzazione di alto livello (tipico di Java o C#) che incapsula dati e procedure, garantendo automaticamente che solo un thread alla volta possa eseguire una procedura al suo interno.  
119. A cosa servono le Variabili di Condizione (Condition Variables)?  
 * Risposta: Sono usate all'interno dei monitor per permettere a un thread di aspettare una condizione specifica (tramite wait()) e di essere risvegliato da un altro (tramite signal()).  
120. Qual è la differenza tra la semantica "Signal and Wait" e "Signal and Continue" nei monitor?  
 * Risposta: In "Signal and Wait", chi segnala aspetta che chi è stato risvegliato esca dal monitor. In "Signal and Continue", chi segnala continua la sua esecuzione e chi è stato risvegliato deve aspettare che il monitor torni libero.  
  
📘 Capitolo 7: Deadlock (Domande 121-140)  
121. Qual è la definizione formale di Deadlock?  
 * Risposta: Una situazione in cui ogni processo in un insieme di processi è in attesa di un evento (tipicamente il rilascio di una risorsa) che può essere causato solo da un altro processo appartenente allo stesso insieme.  
122. Quali sono le 4 condizioni necessarie affinché si verifichi un deadlock?  
 * Risposta: 1) Mutua Esclusione (risorse non condivisibili); 2) Possesso e Attesa (un processo tiene una risorsa e ne aspetta un'altra); 3) Assenza di Preemption (le risorse non possono essere sottratte forzatamente); 4) Attesa Circolare (esiste una catena di processi P_0 \to P_1 \to \dots \to P_n \to P_0).  
123. Cos'è un Grafo di Allocazione delle Risorse (RAG)?  
 * Risposta: È un grafo diretto dove i nodi sono processi (cerchi) e tipi di risorse (quadrati). Un arco P \to R indica una richiesta; un arco R \to P indica un'allocazione.  
     
124. Se un grafo di allocazione contiene un ciclo, c'è sempre un deadlock?  
 * Risposta: Se ogni risorsa ha una sola istanza, un ciclo implica sempre un deadlock. Se ci sono più istanze, il ciclo è una condizione necessaria ma non sufficiente (potrebbe non esserci stallo).  
125. Quali sono i tre modi principali per gestire il Deadlock?  
 * Risposta: 1) Prevenzione o Evitamento (assicurarsi che il sistema non entri mai in deadlock); 2) Rilevamento e Ripristino (lasciare che accada, trovarlo e risolverlo); 3) Ignorare il problema (Algoritmo dello Struzzo, usato da molti SO moderni).  
126. Come si implementa la "Prevenzione" (Prevention) del deadlock?  
 * Risposta: Invalidando almeno una delle 4 condizioni necessarie (es. eliminando l'attesa circolare imponendo un ordine gerarchico alle risorse).  
127. Cos'è la tecnica dell'Attesa Circolare eliminata tramite Ordinamento Gerarchico?  
 * Risposta: Si assegna un numero intero a ogni tipo di risorsa. Un processo può richiedere risorse solo in ordine crescente. Questo impedisce matematicamente la formazione di cicli.  
128. Qual è la differenza tra Prevenzione (Prevention) ed Evitamento (Avoidance)?  
 * Risposta: La prevenzione pone limiti rigidi su come richiedere risorse. L'evitamento analizza dinamicamente ogni richiesta e la concede solo se il sistema rimane in uno "Stato Sicuro".  
129. Definisci lo "Stato Sicuro" (Safe State).  
 * Risposta: Uno stato è sicuro se esiste una sequenza di esecuzione (Safe Sequence) tale che ogni processo possa completare il suo lavoro usando le risorse correnti più quelle rilasciate dai processi precedenti.  
130. Cos'è l'Algoritmo del Banchiere?  
 * Risposta: È un algoritmo di evitamento del deadlock per sistemi con risorse a istanze multiple. Prima di allocare, simula l'assegnazione e verifica se il sistema rimane in uno stato sicuro.  
131. Quali strutture dati servono per l'Algoritmo del Banchiere?  
 * Risposta: 1) Available (risorse libere); 2) Max (richiesta massima di ogni processo); 3) Allocation (risorse già assegnate); 4) Need (Max - Allocation, risorse ancora necessarie).  
132. Cosa succede se una richiesta di risorse porta il sistema in uno "Stato Insicuro"?  
 * Risposta: La richiesta non viene concessa e il processo viene messo in attesa, anche se le risorse sono fisicamente disponibili in quel momento.  
133. Descrivi l'Algoritmo di Rilevamento per istanze singole (Wait-for Graph).  
 * Risposta: Si crea un grafo dove i nodi sono solo i processi. Un arco P_i \to P_j esiste se P_i aspetta una risorsa tenuta da P_j. Se c'è un ciclo, c'è un deadlock.  
134. Ogni quanto dovrebbe essere eseguito l'algoritmo di rilevamento?  
 * Risposta: Dipende dalla frequenza prevista dei deadlock e da quanti processi saranno influenzati. Eseguirlo a ogni richiesta è costoso (overhead CPU).  
135. Quali sono le due opzioni per il Ripristino (Recovery) da un deadlock?  
 * Risposta: 1) Terminazione dei processi (uccidere uno o tutti i processi coinvolti); 2) Prelazione delle risorse (sottrarre risorse a un processo e darne a un altro).  
136. Quali sono i criteri per scegliere quale processo terminare in caso di stallo?  
 * Risposta: Priorità del processo, tempo di esecuzione già effettuato, risorse utilizzate, risorse necessarie per finire e se il processo è interattivo o batch.  
137. Cos'è il "Rollback" nel recupero da deadlock?  
 * Risposta: Riportare un processo a uno stato precedente sicuro (checkpoint) e ricominciare l'esecuzione da lì, dopo avergli sottratto la risorsa contesa.  
138. Spiega il problema della Starvation nel recupero da deadlock.  
 * Risposta: Se si sceglie sempre lo stesso processo come "vittima" per la prelazione (perché è il più economico da interrompere), quel processo non finirà mai. Occorre includere il numero di "vittimizzazioni" nel criterio di scelta.  
139. Perché i sistemi operativi moderni spesso usano l'Algoritmo dello Struzzo?  
 * Risposta: Perché il costo degli algoritmi di prevenzione/evitamento è troppo alto rispetto alla rarità del deadlock nei sistemi desktop. Si preferisce far crashare il sistema una volta all'anno piuttosto che rallentarlo ogni secondo.  
140. Differenza tra Deadlock e Livelock.  
 * Risposta: Nel Deadlock i processi sono bloccati (waiting). Nel Livelock i processi continuano a cambiare stato (attivi) ma nessuno dei due fa progressi, come due persone che cercano di evitarsi in un corridoio spostandosi continuamente dallo stesso lato.  
  
📘 Capitolo 8: Memoria Principale (Domande 141-160)  
141. Perché è necessaria la protezione della memoria in un sistema multiprogrammato?  
 * Risposta: Per evitare che un processo utente acceda alla memoria del kernel o di altri processi, garantendo la stabilità e la sicurezza del sistema.  
142. Come vengono utilizzati i registri "Base" e "Limite"?  
 * Risposta: Il registro Base contiene l'indirizzo fisico più basso legale; il registro Limite specifica la dimensione del range. Ogni indirizzo generato dalla CPU viene controllato: deve essere \ge \text{Base} e < \text{Base} + \text{Limite}.  
143. Cos'è la MMU (Memory Management Unit)?  
 * Risposta: È un dispositivo hardware che trasforma in tempo reale gli indirizzi logici (virtuali) in indirizzi fisici.  
144. Spiega il concetto di "Spazio di Indirizzamento Logico".  
 * Risposta: È l'insieme di tutti gli indirizzi generati da un programma durante l'esecuzione. Non corrispondono necessariamente a posizioni reali nella RAM.  
145. Cosa si intende per "Caricamento Dinamico" (Dynamic Loading)?  
 * Risposta: Una routine non viene caricata in memoria finché non viene chiamata. Questo permette di risparmiare RAM, caricando solo il codice effettivamente utilizzato.  
146. Cos'è lo "Swapping" (Scambio)?  
 * Risposta: Una tecnica che permette di spostare temporaneamente un processo dalla memoria principale a un'area di memoria secondaria (backing store) per liberare RAM, e poi riportarlo indietro per continuare l'esecuzione.  
147. Qual è il limite principale dello Swapping classico?  
 * Risposta: L'elevato tempo di trasferimento tra disco e RAM, che può rendere il sistema molto lento se lo swapping avviene troppo frequentemente (thrashing).  
148. Descrivi l'allocazione a Partizioni Fissee.  
 * Risposta: La memoria è divisa in sezioni di dimensione fissa. Ogni partizione può ospitare un solo processo. È semplice ma causa frammentazione interna.  
149. Descrivi l'allocazione a Partizioni Variabili.  
 * Risposta: Il sistema operativo mantiene una tabella delle parti di memoria occupate e libere. Quando un processo arriva, gli viene assegnato un blocco di memoria grande quanto serve. Causa frammentazione esterna.  
150. Cos'è un "Hole" (Buco) nella gestione della memoria?  
 * Risposta: Un blocco di memoria libera. Nel tempo, la memoria diventa un insieme di processi e buchi di varie dimensioni.  
151. Spiega la frammentazione esterna nell'allocazione contigua.  
 * Risposta: Avviene quando la memoria libera totale è sufficiente per un processo, ma è divisa in molti piccoli fori non contigui.  
152. Cos'è la frammentazione interna?  
 * Risposta: Memoria sprecata quando a un processo viene assegnata una porzione di memoria leggermente più grande di quella richiesta (es. in partizioni fisse o pagine).  
153. Come aiuta la Paginazione a risolvere la frammentazione esterna?  
 * Risposta: Permette allo spazio di indirizzamento fisico di un processo di essere non contiguo, mappando pagine logiche in frame fisici ovunque siano disponibili.  
154. Qual è la struttura della Page Table (Tabella delle Pagine)?  
 * Risposta: È un array di voci (PTE - Page Table Entries) dove l'indice è il numero di pagina e il valore contenuto è il numero di frame fisico.  
155. Cos'è l'Offset (d) nell'indirizzamento paginato?  
 * Risposta: Rappresenta lo spostamento all'interno della pagina. Combinato con l'indirizzo base del frame, determina l'indirizzo fisico esatto.  
156. Perché il TLB è necessario nella paginazione?  
 * Risposta: Per ridurre l'overhead degli accessi alla memoria. Senza TLB, ogni lettura/scrittura richiederebbe due accessi alla RAM (uno per la tabella, uno per il dato).  
157. Cosa succede durante un "Context Switch" in un sistema paginato rispetto al TLB?  
 * Risposta: Il TLB deve essere svuotato (flushed) affinché il nuovo processo non usi le traduzioni del vecchio, oppure ogni entry del TLB deve avere un identificatore di processo (ASID).  
158. Descrivi la Paginazione Gerarchica.  
 * Risposta: Una tecnica in cui la tabella delle pagine stessa è divisa in pagine. Serve a gestire spazi di indirizzamento molto grandi senza occupare memoria contigua eccessiva per la tabella.  
159. Cosa sono le Pagine Condivise (Shared Pages)?  
 * Risposta: Sono pagine di codice "read-only" che possono essere mappate negli spazi logici di più processi contemporaneamente (es. le librerie di sistema).  
160. Cos'è la Segmentazione?  
 * Risposta: Uno schema di gestione della memoria che asseconda la visione dell'utente: la memoria è divisa in segmenti logici (es. segmento codice, segmento stack, segmento dati) invece che in pagine di dimensione fissa.  
  
📘 Capitolo 9: Memoria Virtuale (Domande 161-180)  
161. Cos'è la Memoria Virtuale e qual è il suo vantaggio principale?  
 * Risposta: È una tecnica che permette l'esecuzione di processi che non sono completamente carichi in memoria fisica. Il vantaggio principale è che lo spazio di indirizzamento logico può essere molto più grande della RAM fisica, permettendo una maggiore multiprogrammazione.  
162. Spiega il concetto di "Paginazione su Richiesta" (Demand Paging).  
 * Risposta: È un sistema di paginazione in cui le pagine vengono caricate in RAM solo quando vengono effettivamente richieste durante l'esecuzione, riducendo l'I/O inutile e l'occupazione di memoria.  
163. Cosa succede durante un Page Fault (Errore di pagina)?  
 * Risposta: La CPU prova ad accedere a una pagina con bit di validità "invalido". L'hardware solleva un trap al SO, che deve: 1) Trovare la pagina su disco; 2) Trovare un frame libero; 3) Caricare la pagina; 4) Aggiornare la tabella delle pagine; 5) Riavviare l'istruzione interrotta.  
164. Cos'è il "Pure Demand Paging"?  
 * Risposta: Un caso estremo in cui un processo viene avviato con zero pagine in RAM. Ogni singola istruzione iniziale causerà un page fault finché le pagine necessarie non saranno caricate.  
165. Perché è necessario il supporto hardware per la paginazione su richiesta?  
 * Risposta: Serve una tabella delle pagine con bit valido/invalido e un meccanismo hardware capace di riavviare un'istruzione esattamente dal punto in cui è stata interrotta dal page fault.  
166. Definisci l'Effective Access Time (EAT) per la memoria virtuale.  
 * Risposta: È il tempo medio di accesso che considera la probabilità p di un page fault. EAT = (1 - p) \times \text{accesso\_RAM} + p \times \text{tempo\_gestione\_page\_fault}. Dato che il tempo di accesso al disco è enorme, anche un p piccolissimo rallenta drasticamente il sistema.  
167. Cos'è la Sostituzione della Pagina (Page Replacement)?  
 * Risposta: Quando si verifica un page fault ma non ci sono frame liberi, il SO deve scegliere una pagina vittima in RAM, scriverla su disco (se modificata) e sostituirla con la pagina richiesta.  
168. A cosa serve il "Dirty Bit" (o Modify Bit)?  
 * Risposta: Indica se una pagina in RAM è stata modificata rispetto alla sua copia su disco. Se il bit è 0, la pagina vittima può essere sovrascritta senza scrivere sul disco, dimezzando il tempo di sostituzione.  
169. Descrivi l'algoritmo di sostituzione FIFO e il suo difetto (Anomalia di Belady).  
 * Risposta: Sostituisce la pagina più vecchia. L'anomalia di Belady è il fenomeno per cui, in alcuni casi, aumentando il numero di frame fisici disponibili, il numero di page fault aumenta invece di diminuire.  
170. Qual è l'Algoritmo Ottimale (OPT) di sostituzione?  
 * Risposta: Sostituisce la pagina che non sarà usata per il periodo di tempo più lungo in futuro. È impossibile da implementare perché richiede la conoscenza del futuro, ma funge da benchmark.  
171. Spiega l'algoritmo LRU (Least Recently Used).  
 * Risposta: Sostituisce la pagina che non viene utilizzata da più tempo. Si basa sul principio di località temporale: se una pagina è stata usata di recente, è probabile che venga usata di nuovo.  
172. Quali sono i limiti dell'implementazione di LRU?  
 * Risposta: Richiede un supporto hardware costoso (contatori o stack per ogni accesso alla memoria). Spesso si usano algoritmi di approssimazione LRU (come l'algoritmo Second-Chance).  
173. Come funziona l'algoritmo della Seconda Occasione (Second-Chance/Clock)?  
 * Risposta: Usa un bit di riferimento. Se la pagina selezionata (FIFO) ha il bit a 1, le viene data una "seconda occasione" (bit azzerato) e si passa alla successiva. Se il bit è 0, viene sostituita.  
174. Cos'è l'Allocazione Fisofissa vs Allocazione Prioritaria dei frame?  
 * Risposta: L'allocazione fissa assegna un numero fisso di frame a ogni processo. L'allocazione prioritaria permette a un processo ad alta priorità di "rubare" frame a processi a bassa priorità.  
175. Definisci il fenomeno del Thrashing.  
 * Risposta: Una situazione in cui un processo passa più tempo a paginare (fare I/O) che a eseguire calcoli. Accade quando un processo non ha abbastanza frame per contenere il suo "Working Set".  
176. Cos'è il Modello del Working Set?  
 * Risposta: Si basa sul principio di località. Il Working Set è l'insieme delle pagine usate attivamente da un processo in un intervallo di tempo \Delta. Il SO deve garantire che la somma dei Working Set di tutti i processi sia \le RAM totale per evitare il thrashing.  
177. Cos'è il File Mapping (Memory-Mapped Files)?  
 * Risposta: Permette di mappare un file su disco direttamente nello spazio di indirizzamento virtuale di un processo, trattando l'I/O del file come normali accessi alla memoria.  
178. Come viene gestita la memoria Kernel rispetto a quella utente?  
 * Risposta: Il kernel spesso richiede memoria contigua per l'hardware (DMA). Usa algoritmi specifici come il Buddy System o lo Slab Allocation per minimizzare la frammentazione interna ed esterna.  
179. Spiega il Buddy System.  
 * Risposta: Alloca memoria in potenze di 2. Se serve un blocco da 4KB e ne hai uno da 8KB, lo dividi in due "buddy" da 4KB. Quando vengono liberati, se entrambi sono liberi, si ricombinano in un blocco unico.  
180. Cos'è la Slab Allocation?  
 * Risposta: Usa cache di oggetti pre-allocati (es. PCB, semafori) per evitare la frammentazione e velocizzare l'allocazione di strutture dati del kernel usate frequentemente.  
  
📘 Capitolo 10: Struttura della Memoria di Massa (Domande 181-200)  
181. Quali sono le tre componenti principali della latenza di un disco magnetico (HDD)?  
 * Risposta: 1) Seek time (tempo di posizionamento della testina sul cilindro); 2) Rotational latency (tempo affinché il settore desiderato ruoti sotto la testina); 3) Transfer time (tempo effettivo di spostamento dei dati).  
182. Perché è necessario lo scheduling del disco (Disk Scheduling)?  
 * Risposta: Poiché l'accesso al disco è estremamente lento rispetto alla CPU, il SO deve ordinare le richieste di I/O per minimizzare il movimento totale della testina (seek time) e massimizzare il throughput.  
183. Descrivi l'algoritmo FCFS (First-Come, First-Served) per il disco.  
 * Risposta: Le richieste sono servite nell'ordine in cui arrivano. È intrinsecamente equo ma non ottimizza affatto il movimento della testina, causando spostamenti selvaggi tra cilindri distanti.  
184. Come funziona l'algoritmo SSTF (Shortest Seek Time First)?  
 * Risposta: Seleziona la richiesta più vicina alla posizione attuale della testina. Riduce drasticamente il movimento della testina rispetto a FCFS, ma può causare starvation per le richieste lontane.  
185. Spiega l'algoritmo SCAN (o algoritmo dell'ascensore).  
 * Risposta: La testina si muove da un'estremità all'altra del disco servendo le richieste lungo il percorso, per poi invertire la direzione una volta arrivata in fondo.  
186. Qual è la differenza tra SCAN e C-SCAN (Circular SCAN)?  
 * Risposta: In C-SCAN, quando la testina arriva alla fine, torna immediatamente all'inizio senza servire richieste durante il ritorno. Fornisce un tempo di attesa più uniforme rispetto allo SCAN normale.  
187. Descrivi gli algoritmi LOOK e C-LOOK.  
 * Risposta: Sono versioni ottimizzate di SCAN e C-SCAN: la testina non arriva fino al bordo fisico del disco, ma inverte la marcia non appena ha servito l'ultima richiesta nella direzione corrente.  
188. Come deve scegliere il SO l'algoritmo di scheduling del disco?  
 * Risposta: Dipende dal carico: SSTF o LOOK sono buone scelte standard. SCAN/C-SCAN sono migliori per sistemi con carichi pesanti. Molti SO moderni usano scheduler specifici per gestire code separate (es. per letture prioritarie).  
189. Cos'è la Formattazione a Basso Livello (Low-level formatting)?  
 * Risposta: È la creazione dei settori fisici sul disco, ognuno con un'intestazione (header), un'area dati e un codice di correzione errori (ECC). Viene fatta in fabbrica.  
190. Cos'è la Formattazione Logica e la creazione del File System?  
 * Risposta: Il SO crea le strutture dati del file system (come la FAT o l'Innode table) e divide il disco in partizioni.  
191. Cos'è il Master Boot Record (MBR)?  
 * Risposta: È il primo settore del disco che contiene il codice per avviare il SO e la tabella delle partizioni.  
192. Come vengono gestiti i "Bad Blocks" (settori danneggiati)?  
 * Risposta: Il controller del disco mantiene una lista di settori di riserva. Tramite il sector sparing, mappa un settore logico danneggiato su un settore fisico sano di riserva.  
193. Cos'è lo Swap Space (Spazio di scambio) e dove risiede?  
 * Risposta: È un'area del disco usata per estendere la RAM fisica. Può risiedere in un file all'interno del file system o, più efficientemente, in una partizione separata e dedicata.  
194. Definisci la struttura RAID (Redundant Array of Independent Disks).  
 * Risposta: Una tecnica che utilizza più dischi in parallelo per aumentare l'affidabilità (tramite ridondanza) e le prestazioni (tramite parallelismo dei dati).  
195. Differenza tra RAID 0 (Striping) e RAID 1 (Mirroring).  
 * Risposta: RAID 0 divide i dati su più dischi per la velocità ma non ha tolleranza ai guasti. RAID 1 duplica i dati su due dischi per la sicurezza (se uno muore, i dati sono nell'altro).  
196. Cos'è il RAID 5 (Parità distribuita)?  
 * Risposta: I dati e le informazioni di parità sono distribuiti su tutti i dischi. Permette di perdere un disco senza perdere dati, con un costo in spazio inferiore rispetto al mirroring (RAID 1).  
197. Cos'è il RAID 6 e perché è più sicuro del RAID 5?  
 * Risposta: Usa una doppia parità distribuita, permettendo al sistema di continuare a funzionare anche se falliscono due dischi contemporaneamente.  
198. Qual è la differenza principale tra HDD e SSD (Solid State Drive) nello scheduling?  
 * Risposta: Gli SSD non hanno parti meccaniche (testine), quindi il "seek time" è quasi nullo. Gli algoritmi come SCAN sono inutili; lo scheduling degli SSD si concentra sul bilanciamento dell'usura (wear leveling).  
199. Cos'è il NAS (Network-Attached Storage)?  
 * Risposta: Un dispositivo di memoria di massa collegato a una rete anziché direttamente al computer, che fornisce accesso ai dati a livello di file.  
200. Cos'è la SAN (Storage Area Network)?  
 * Risposta: Una rete dedicata ad alta velocità che collega server e dispositivi di storage, fornendo accesso ai dati a livello di blocchi (come se fossero dischi locali).  
  
📘 Capitolo 11: Interfaccia del File System (Domande 201-220)  
201. Cos'è un File dal punto di vista del Sistema Operativo?  
 * Risposta: È un'unità logica di memorizzazione, definita come un insieme di informazioni correlate registrate sulla memoria secondaria. È un'astrazione dell'hardware.  
202. Quali sono gli attributi tipici di un file?  
 * Risposta: Nome, identificatore univoco (ID), tipo, posizione sul dispositivo, dimensione, protezione (permessi) e timestamp (creazione, modifica).  
203. Descrivi le operazioni base su un file.  
 * Risposta: Creazione, scrittura, lettura, riposizionamento (seek), cancellazione e troncamento.  
204. Perché è necessaria l'operazione di "Open" (Apertura)?  
 * Risposta: Per evitare di cercare il file nella directory a ogni lettura/scrittura. L'apertura copia gli attributi del file in una tabella dei file aperti in RAM, restituendo un file descriptor (o handle).  
205. Qual è la differenza tra la Tabella dei File Aperti del Sistema e quella del Processo?  
 * Risposta: Quella del processo contiene informazioni locali (es. il puntatore alla posizione corrente); quella del sistema contiene informazioni condivise (es. il numero di processi che hanno aperto quel file per gestirne la chiusura).  
206. Spiega la differenza tra Accesso Sequenziale e Accesso Diretto.  
 * Risposta: L'accesso sequenziale legge i dati nell'ordine in cui sono scritti (come un nastro). L'accesso diretto permette di saltare a un blocco qualsiasi (es. record n. 45) senza leggere i precedenti (tipico dei dischi).  
207. Cos'è una Directory?  
 * Risposta: È un "contenitore" che mappa i nomi dei file nelle loro voci corrispondenti (FCB - File Control Block). Può essere vista come una tabella di simboli.  
208. Descrivi la struttura di directory a due livelli.  
 * Risposta: Ogni utente ha la propria directory (UFD) sotto una directory principale (MFD). Risolve i conflitti di nomi tra utenti diversi, ma non permette di organizzare i file in sottocartelle.  
209. Cos'è la struttura di directory ad Albero (Tree-Structured Directory)?  
 * Risposta: È la struttura moderna in cui una directory può contenere file e altre sottodirectory, permettendo un'organizzazione gerarchica infinita.  
210. Qual è la differenza tra un Cammino Assoluto (Absolute Path) e uno Relativo?  
 * Risposta: Il cammino assoluto inizia dalla radice (root, /); quello relativo inizia dalla directory corrente di lavoro (Working Directory).  
211. Cos'è un Grafo Aciclico per le directory?  
 * Risposta: Una struttura che permette a directory o file di essere condivisi in più punti (tramite link), ma vieta la creazione di cicli che manderebbero gli algoritmi di ricerca in loop infinito.  
212. Spiega la differenza tra Hard Link e Symbolic Link (Soft Link).  
 * Risposta: L'Hard Link è un altro nome per lo stesso file fisico (stesso numero di inode). Il Symbolic Link è un file speciale che contiene il percorso di un altro file.  
213. Cos'è il "Mounting" di un File System?  
 * Risposta: L'operazione con cui un file system esterno viene collegato a un punto specifico (Mount Point) dell'albero delle directory principale, rendendolo accessibile.  
214. Quali sono i metodi principali di condivisione dei file tra utenti?  
 * Risposta: Tramite permessi di accesso (Read, Write, Execute) e tramite ID di utente (UID) e di gruppo (GID) per identificare i proprietari.  
215. Cos'è un File Control Block (FCB)?  
 * Risposta: Una struttura dati (chiamata inode in UNIX) che contiene tutte le informazioni su un file tranne il suo nome (permessi, proprietario, puntatori ai blocchi di dati).  
216. Come vengono gestiti i permessi di accesso in UNIX (rwx)?  
 * Risposta: Vengono assegnati tre bit (leggi, scrivi, esegui) per tre categorie: Proprietario (Owner), Gruppo (Group) e Altri (Public).  
217. Cos'è la Consistenza del File System?  
 * Risposta: Uno stato in cui le strutture dati sul disco (es. bit map dei blocchi liberi) corrispondono alla realtà dei file salvati. In caso di crash, il sistema usa tool come fsck o il Journaling per ripristinarla.  
218. Spiega il concetto di Journaling.  
 * Risposta: Il SO scrive ogni modifica programmata in un file di log (journal) prima di eseguirla. Se il sistema crasha, può rileggere il log e completare o annullare l'operazione in sospeso.  
219. Cos'è il VFS (Virtual File System)?  
 * Risposta: Uno strato del kernel che fornisce un'interfaccia unica per accedere a file system diversi (es. NTFS, ext4, NFS) senza che l'utente o i programmi debbano conoscerne le differenze.  
220. Cos'è il Remote File System (NFS)?  
 * Risposta: Un protocollo che permette a un computer di accedere ai file di un altro computer attraverso la rete come se fossero locali, usando l'architettura Client-Server.  
  
📘 Capitolo 13: Sistemi di I/O (Domande 221-240)  
221. Cos'è il "Bus" e qual è la differenza tra bus di sistema e bus di espansione?  
 * Risposta: Il bus è un insieme di fili e un protocollo che permette il passaggio di segnali tra componenti. Il bus di sistema collega CPU e RAM; il bus di espansione (es. PCIe) collega i dispositivi di I/O (schede video, dischi).  
222. Cosa sono i Registri del Controller (Porte di I/O)?  
 * Risposta: Ogni dispositivo è gestito da un controller che comunica con la CPU tramite quattro registri: Data-in (lettura), Data-out (scrittura), Status (stato del dispositivo) e Control (comandi).  
223. Spiega la differenza tra I/O tramite porte e Memory-Mapped I/O.  
 * Risposta: Nell'I/O tramite porte, la CPU usa istruzioni speciali (es. in, out). Nel Memory-Mapped I/O, i registri del controller sono mappati in indirizzi di memoria: la CPU scrive/legge in RAM per comandare l'hardware.  
224. Cos'è il Polling (Busy Waiting) e quando è inefficiente?  
 * Risposta: È la tecnica in cui la CPU legge ripetutamente il registro di Status finché il dispositivo non è pronto. È inefficiente se il dispositivo è lento, perché spreca cicli di CPU in un ciclo inutile.  
225. Descrivi il meccanismo degli Interrupt (Interruzioni) nell'I/O.  
 * Risposta: Il dispositivo invia un segnale hardware alla CPU quando ha finito un compito. La CPU sospende il processo corrente, esegue l'Interrupt Handler e poi riprende il lavoro. Evita il polling.  
226. Cos'è il Controller delle Interruzioni (APIC)?  
 * Risposta: Un componente hardware che gestisce le priorità delle interruzioni, decidendo quale segnalare alla CPU se ne arrivano più contemporaneamente.  
227. Spiega il Direct Memory Access (DMA).  
 * Risposta: È un controller speciale che gestisce il trasferimento di dati tra memoria e dispositivo senza l'intervento della CPU per ogni byte. La CPU interviene solo all'inizio e alla fine del trasferimento.  
228. Qual è la differenza tra un'interfaccia a blocchi e una a caratteri?  
 * Risposta: I dispositivi a blocchi (es. HDD/SSD) leggono/scrivono unità di dimensione fissa e permettono l'accesso diretto. I dispositivi a caratteri (es. tastiera/mouse) gestiscono un flusso di singoli byte in ordine sequenziale.  
229. Cos'è il Blocking I/O (I/O bloccante)?  
 * Risposta: Quando un processo chiede un I/O, la sua esecuzione viene sospesa (stato Waiting) finché l'operazione non è completata. È il metodo più semplice per il programmatore.  
230. Cos'è il Non-blocking I/O?  
 * Risposta: La chiamata di I/O restituisce immediatamente il controllo al processo con un valore che indica se l'operazione è pronta o meno. Il processo continua a girare.  
231. Spiega l'Asynchronous I/O (I/O asincrono).  
 * Risposta: Il processo richiede l'I/O e continua l'esecuzione. Il SO notificherà il processo (tramite segnale o callback) solo quando l'intera operazione sarà conclusa.  
232. Cos'è il Buffering e perché si usa?  
 * Risposta: È l'uso di un'area di memoria per memorizzare dati durante il trasferimento. Serve a gestire differenze di velocità tra dispositivi, differenze di dimensione dei dati e a supportare la semantica di "copia" dei dati.  
233. Cos'è il Caching nel sistema di I/O?  
 * Risposta: Mantenere una copia dei dati in una memoria veloce per accelerare gli accessi futuri (es. mantenere in RAM i settori del disco letti spesso).  
234. Cos'è lo Spooling (Simultaneous Peripheral Operations On-Line)?  
 * Risposta: Un buffer usato per dispositivi che non possono gestire flussi di dati interlacciati (es. la stampante). I dati dei vari processi vengono accumulati su disco e inviati uno alla volta al dispositivo.  
235. Qual è il ruolo del Device Driver?  
 * Risposta: È lo strato software specifico per un hardware che "traduce" le chiamate generiche del kernel (es. read()) in comandi specifici per quel controller.  
236. Cos'è il sottosistema di I/O del Kernel?  
 * Risposta: È la parte del kernel che fornisce servizi comuni a tutti i driver: scheduling dell'I/O, buffering, caching, spooling, protezione e gestione degli errori.  
237. Spiega la gestione degli errori nell'I/O.  
 * Risposta: Il SO deve gestire fallimenti hardware (es. disco pieno o non leggibile) restituendo codici d'errore o tentando di ripetere l'operazione se il problema è transitorio.  
238. Cos'è la "I/O Protection"?  
 * Risposta: Tutte le istruzioni di I/O sono istruzioni privilegiate. Un utente non può accedere direttamente all'hardware, ma deve passare attraverso system call affinché il SO possa controllare i permessi.  
239. Cos'è il concetto di "Double Buffering"?  
 * Risposta: L'uso di due buffer: mentre il dispositivo riempie uno, la CPU elabora l'altro. Migliora le prestazioni parallelizzando I/O ed elaborazione.  
240. Descrivi la "I/O Request Packet" (IRP) in sistemi come Windows.  
 * Risposta: Una struttura dati che rappresenta una richiesta di I/O che attraversa i vari strati del kernel (dal file system al driver fisico) portando con sé parametri e stato.  
  
📘 Capitolo 14: Protezione (Domande 241-260)  
241. Qual è la differenza tra Protezione e Sicurezza?  
 * Risposta: La Protezione riguarda i meccanismi interni per controllare l'accesso alle risorse da parte di processi e utenti. La Sicurezza riguarda la difesa del sistema da minacce esterne (virus, hacker) e interne (furto di dati).  
242. Cos'è il "Principio del Privilegio Minimo" (Least Privilege)?  
 * Risposta: Gli utenti e i processi devono operare con il set minimo di privilegi necessari per completare il proprio compito, limitando i danni in caso di errore o compromissione.  
243. Cos'è un Dominio di Protezione (Protection Domain)?  
 * Risposta: È una collezione di coppie (oggetto, diritti-di-accesso). Definisce cosa un processo può fare su quali risorse in un dato momento.  
244. Spiega il concetto di Matrice di Accesso (Access Matrix).  
 * Risposta: È un modello astratto dove le righe sono i domini, le colonne sono gli oggetti e le celle contengono i diritti (es. read, write).  
245. Cos'è una Access Control List (ACL)?  
 * Risposta: È un'implementazione della matrice per colonne: ogni oggetto ha una lista di domini e i relativi permessi. È usata comunemente nei file system (es. Windows NTFS).  
246. Cos'è una Capability List (C-List)?  
 * Risposta: È un'implementazione della matrice per righe: ogni processo possiede una lista di "biglietti" (capability) che gli danno diritto ad accedere a determinati oggetti.  
247. Cos'è il "Role-Based Access Control" (RBAC)?  
 * Risposta: I privilegi sono assegnati a ruoli (es. "Amministratore", "Studente") e gli utenti vengono assegnati ai ruoli. Semplifica la gestione in sistemi grandi.  
248. Spiega la differenza tra Revoca Immediata e Revoca Differita dei diritti.  
 * Risposta: La revoca immediata cancella il diritto istantaneamente (facile con le ACL, difficile con le Capability); quella differita avviene dopo un certo tempo o al verificarsi di un evento.  
249. Cos'è il meccanismo dei "Password-based Capabilities"?  
 * Risposta: Un approccio ibrido dove l'accesso a un oggetto è garantito dal possesso di una chiave crittografica o una password specifica.  
250. Descrivi la protezione basata su anelli (Protection Rings).  
 * Risposta: L'hardware divide i privilegi in cerchi concentrici. L'anello 0 (Kernel) ha pieni poteri, l'anello 3 (User) ha poteri minimi. Il passaggio avviene tramite "gate" controllati.  
💀 Le 10 Domande "Killer" (Integrazione Totale)  
Queste domande richiedono di collegare più capitoli. Se rispondi bene a queste, hai il 30 in tasca.  
K1. Collega la Paginazione alla Protezione: come fa l'hardware a impedire che un processo acceda alla memoria di un altro?  
 * Risposta: Ogni processo ha la sua Page Table privata gestita dal kernel. Poiché la CPU usa solo la tabella del processo corrente (puntata dal PTBR), è fisicamente impossibile per un processo generare un indirizzo che punti a un frame di un altro processo, a meno che non siano Shared Pages esplicitamente configurate dal SO.  
K2. Come interagisce lo Scheduling della CPU con il Context Switch?  
 * Risposta: Lo scheduler sceglie il prossimo processo, ma il Dispatcher esegue materialmente il context switch salvando il PCB del vecchio e caricando quello del nuovo. Se la frequenza di scheduling è troppo alta, l'overhead del context switch degrada le prestazioni totali.  
K3. Perché il DMA può essere un problema per la coerenza della Cache?  
 * Risposta: Poiché il DMA scrive direttamente in RAM senza passare dalla CPU, i dati presenti nella Cache della CPU potrebbero risultare obsoleti (stale data). Il sistema deve invalidare la cache o usare protocolli di "cache snooping".  
K4. Qual è il legame tra Interrupt e System Call?  
 * Risposta: Una System Call viene spesso implementata come un'interruzione software o Trap. Quando il programma chiama una funzione del kernel, l'hardware solleva una trap, cambia il Mode Bit a 0 (Kernel) e salta alla routine di servizio corrispondente nel vettore delle interruzioni.  
K5. Come può un Deadlock influenzare la gestione della memoria?  
 * Risposta: In sistemi con Swapping, se tutti i processi sono in stallo (deadlock) aspettando risorse I/O, nessuno rilascia memoria RAM. Il sistema potrebbe andare in Thrashing o bloccarsi completamente perché non c'è memoria libera per far avanzare nessun processo "vittima".  
K6. In che modo la Paginazione Gerarchica aiuta a gestire il "File Mapping"?  
 * Risposta: Permette di mappare file enormi nello spazio virtuale senza caricare tutto il file in RAM. Solo le tabelle delle pagine interne necessarie vengono create quando si accede a una parte specifica del file (Demand Paging).  
K7. Descrivi il percorso di un dato dal Disco alla RAM durante un Page Fault.  
 * Risposta: 1. Trap (Page Fault). 2. Il kernel sospende il processo. 3. Lo Scheduler del Disco ordina la lettura. 4. Il DMA trasferisce il blocco dal disco alla RAM. 5. Un Interrupt segnala la fine dell'I/O. 6. La Page Table viene aggiornata. 7. Il processo torna in Ready Queue.  
K8. Perché i Semafori necessitano di istruzioni atomiche (es. TestAndSet) per essere implementati?  
 * Risposta: Perché le operazioni wait() e signal() modificano una variabile condivisa. Se non fossero atomiche, due processi potrebbero eseguire wait() contemporaneamente causando una Race Condition sul valore del semaforo stesso, rendendo nulla la sincronizzazione.  
K9. Come influisce l'Hit Ratio del TLB sulla velocità di un sistema a 2 o più livelli di paginazione?  
 * Risposta: In un sistema a 2 livelli, un miss costa 3 accessi alla RAM. Con un Hit Ratio alto, la maggior parte degli accessi avviene a velocità cache (hardware), rendendo trascurabile il costo della gerarchia delle tabelle. Se l'Hit Ratio crolla, il sistema rallenta del 300%.  
K10. Perché il Journaling nel File System è considerato una protezione contro i crash?  
 * Risposta: Perché garantisce l'atomicità delle operazioni sul file system. Scrivendo prima l'intenzione nel log, il SO può ripristinare la consistenza delle strutture dati (come i bit di allocazione dei blocchi) anche se l'alimentazione viene interrotta a metà di una scrittura.  
