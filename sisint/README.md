# Quiz Sistemi Intelligenti — UniTO

Quiz interattivo per studenti del corso **Sistemi Intelligenti** (Dip. Informatica, Università di Torino), pensato per la preparazione dell'esame scritto.

Il formato delle domande replica quello del compito (vedi `ESEMPIO.pdf` del 12/12/2022):

- **Parte 1** — domande a scelta multipla (MCQ) con 3 opzioni, una sola corretta
- **Parte 2** — esercizi associativi e vero/falso, in cui ad ogni voce dell'elenco va associata una lettera

All'avvio l'utente sceglie il taglio dell'esame: **6 CFU** o **9 CFU**. Il pool di domande viene filtrato di conseguenza.

## Modalità di studio

- **Simulazione esame** — 5 MCQ + 2 esercizi di matching, come da esempio ufficiale
- **Solo Parte 1 (MCQ)** — tutte le domande a scelta multipla in ordine casuale
- **Solo Parte 2 (matching/VF)** — solo esercizi associativi
- **Studio per argomento** — filtra per Parte (1/2/3) e topic specifico
- **Sfoglia tutte le domande** — vista read-only con risposte evidenziate
- **Flashcards 9 CFU** (`flashcards.html`) — ripasso attivo fronte/retro generato dall'intero bank (MCQ + matching): filtri parte/argomento/tipo, autovalutazione sapevo/non sapevo, le carte sbagliate rientrano nei round successivi

## Argomenti coperti

Il pool di domande è organizzato secondo il programma del corso:

| Parte | Argomenti | CFU |
| --- | --- | --- |
| 1 — Risoluzione di problemi | spazi degli stati, BFS/DFS/IDS, A*/RBFS, euristiche, minimax/alfa-beta, CSP, backtracking, AC-3 | 6+9 |
| 1 — Estensioni 9 CFU | giochi stocastici, expectiminimax, nodi di casualità | 9 |
| 2 — Conoscenza | logica proposizionale, FOL, risoluzione, forward/backward chaining, modus ponens, clausole di Horn, planning, situation calculus, frame problem | 6+9 |
| 2 — Estensioni 9 CFU | lifting di risoluzione, Skolemizzazione, refutation, ontologie (RDF/OWL, allineamento ontologico, partizioni, part-of/bunch-of), probabilità e regola di Bayes, reti bayesiane (Markov blanket, naive Bayes, semantica globale/locale) | 9 |
| 3 — Agenti e apprendimento | tipologie di agenti, classificazione, alberi di decisione, algoritmo di Hunt, entropia, overfitting, perceptron, MLP, backpropagation | 6+9 |
| 3 — Estensioni 9 CFU | reinforcement learning, MDP, equazione di Bellman, attention/transformer, LLM (embeddings, tf-idf, fasi di apprendimento, bias), clustering*, sistemi di regole*, IA generativa*, CNN/RNN*, GAN*, diffusion* | 9 |

> **Aggiornamento AA 2024/25:** gli appunti di Altair ora includono la parte 9 CFU; le domande sui relativi argomenti (giochi stocastici, lifting/risoluzione FOL, ontologie, incertezza e reti bayesiane, RL, attention/transformer, LLM) citano quindi `sisint1`. Le fonti esterne nella tabella sotto restano solo per le domande 6 CFU che le richiamano (`aima_ch3`, `ontologie`, `risol_FOL`, `aima_ch9`); `con_avv_9cfu` e `aima_ch10/12/13` non sono più usate.

\* Argomenti **integrati** — non presenti direttamente nel materiale fornito (SISINT-1, slides Baroglio), ma menzionati esplicitamente nel programma 9 CFU del corso. Sono basati su conoscenze standard di IA. Sono marcati nel quiz con il badge arancione **«argomento integrato»**.

## Fonti citate per ogni domanda

| `source` nel CSV | Etichetta nel sito |
| --- | --- |
| `sisint1` | Appunti SISINT-1 (Altair, CC-BY 4.0) |
| `con_avv_9cfu` | Slides "con avversario" 9 CFU (Baroglio) |
| `risol_FOL` | Slides "risoluzione FOL" (Baroglio) |
| `ontologie` | Slides "ontologie" 9 CFU (Baroglio) |
| `aima_chN` | Russell & Norvig, *Artificial Intelligence: A Modern Approach* (4ed), capitolo N |
| `integrato` | Argomento integrato — non in materiale fornito |

## Struttura dei file

```
site/
├── index.html      pagina unica con tutte le schermate
├── style.css       fogli di stile
├── app.js          logica del quiz (vanilla JS + PapaParse via CDN)
├── mcq.csv         domande a scelta multipla
├── matching.csv    esercizi di matching / vero-falso
└── README.md
```

### Formato `mcq.csv`

```
id,cfu,parte,topic,question,opt_a,opt_b,opt_c,correct,source
```

- `cfu`: `both` | `9` (le `both` valgono per entrambi i tagli)
- `parte`: `1` | `2` | `3`
- `correct`: `a` | `b` | `c`

### Formato `matching.csv`

```
group_id,item_id,cfu,parte,topic,group_text,labels,item_text,correct,source
```

- una riga per ogni voce all'interno di un gruppo
- `labels`: lista di etichette separate da `|`, ciascuna nel formato `chiave=descrizione` (es. `T=vero|F=falso` o `A=tautologia|B=clausola|C=ground|D=FOL`)
- `correct`: la chiave dell'etichetta corretta

## Aggiungere/modificare domande

Per aggiungere una nuova domanda MCQ: appendi una riga a `mcq.csv`. Per testi che contengono virgole, racchiudi il campo tra virgolette doppie. Esempio:

```csv
211,both,2,horn,"Una clausola di Horn ha al più, oltre a letterali negativi:",un letterale positivo,due letterali positivi,nessun letterale negativo,a,sisint1
```

Per aggiungere un gruppo di matching, scegli un nuovo `group_id` (intero non utilizzato) e aggiungi una riga per ogni voce, ripetendo `cfu`, `parte`, `topic`, `group_text`, `labels`, `source` su ciascuna.

Il sito non richiede compilazione: ricaricare il browser dopo la modifica è sufficiente (cache permettendo).

## Deploy su GitHub Pages

1. Crea un repository pubblico (es. `sisint-quiz`).
2. Copia il contenuto della cartella `site/` nella root del repository.
3. Push.
4. Su GitHub vai in **Settings → Pages**, seleziona la branch `main` e la cartella `/ (root)`.
5. Dopo 1–2 minuti il sito è disponibile a `https://<utente>.github.io/<repo>/`.

**Importante**: non committare i PDF (`SISINT-1.pdf`, `Artificial Intelligence A Modern Approach`, ecc.) — sono materiale didattico di terzi e pesano centinaia di MB. Vedi `.gitignore`.

## Test in locale

```bash
cd site/
python3 -m http.server 8000
# apri http://localhost:8000 nel browser
```

I file CSV devono essere serviti da un web server (non `file://`) per via di CORS.

## Licenza

Il codice del quiz è rilasciato sotto licenza MIT — usalo liberamente, anche modificandolo.

Le **domande** sono basate sul materiale didattico del corso. Gli appunti SISINT-1 sono CC-BY 4.0 (Altair). Le slides della Prof.ssa Cristina Baroglio sono materiale didattico UniTO — uso consentito a fini di studio. AIMA è di Russell & Norvig (Pearson) — uso citazionale equo per scopi educativi.

Il presente quiz non è materiale ufficiale del corso e non sostituisce le lezioni o gli appunti.
