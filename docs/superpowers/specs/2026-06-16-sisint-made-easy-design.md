# SISINT Made Easy — Design

**Data:** 2026-06-16
**Stato:** approvato (design)

## Obiettivo

Nuova sezione del sito che organizza tutti gli appunti SISINT (4 fogli manoscritti)
in una **struttura a grafo** di concetti con dipendenze e collegamenti. La rete:

1. è visualizzabile come **più strutture** spiegate negli stessi appunti (force-directed,
   rete di Bayes/DAG, MLP a layer, albero di decisione, tassonomia IS-A);
2. permette di **cercare un argomento** e di animare la ricerca con gli algoritmi
   visti nel corso (cieca: BFS/DFS/IDS/UCS; informata: Greedy/A*) come **PoC interattivo**;
3. ogni **nodo = un argomento**: al click si apre la spiegazione "made easy".

## Vincoli e stile

- Self-contained, vanilla JS + SVG. Nessuna dipendenza pesante (coerente col resto del sito).
- Riuso delle variabili CSS / tema dark-light esistenti (`sisint/style.css`).
- Lingua: italiano. Tono spiegazioni: semplice, diretto, "made easy" (non formato-esame).
- Linkata da `sisint/index.html` con una card nuova.

## Architettura file

```
sisint/
  grafo.html       # markup pagina: toolbar, canvas SVG, pannello laterale, pannello ricerca
  grafo.js         # render SVG, mini force-sim, layout, algoritmi di ricerca, interazione
  graph-data.js    # DATI: nodi (id, label, categoria, blurb, flashId?) + archi (tipizzati)
  grafo.css        # stili specifici (riusa le :root var di style.css)
```

`grafo.html` carica `style.css` (per le variabili) + `grafo.css` + `graph-data.js` + `grafo.js`.

## Modello dati (`graph-data.js`)

### Nodo
```js
{ id:"a_star", label:"A*", cat:"SE",
  blurb:"f(n)=g(n)+h(n). Ottima se h è ammissibile/consistente.",
  flash: 42 /* id flashcard opzionale, link "approfondisci" */ }
```

### Arco (tipizzato)
```js
{ s:"informata", t:"a_star", type:"prereq" }   // prerequisito (freccia)
{ s:"is_a_rel",  t:"member", type:"isa" }       // tassonomia
{ s:"bias",      t:"underfitting", type:"rel" } // correlato
```

Tipi arco: `prereq` (dipendenza, dà direzione ai layout DAG/MLP/albero), `isa`
(gerarchia tassonomica), `rel` (collegamento generico). I tipi guidano sia il colore
dell'arco sia quali layout sono "diretti".

### Categorie (cluster, colore per categoria)
AG Agenti · SE Ricerca · CSP · GA Giochi · PL Logica proposizionale · FOL ·
KR Ontologie/KR · ML Apprendimento · NN Reti neurali · GEN IA generativa ·
NLP Transformer/LLM · PR Probabilità/Bayes · PLAN Planning.

## Inventario nodi (dagli appunti)

**AG Agenti:** agente, sensori-attuatori, ambiente (oss./det./noto), reattivo-semplice,
basato-su-modello, goal-driven, utility-driven, dichiarativo-vs-procedurale, agente-che-apprende
(elemento esecutivo / di apprendimento / critico / generatore problemi).

**SE Ricerca:** problema-di-ricerca, ricerca-cieca, tree-vs-graph, BFS, DFS, IDS, UCS,
ricerca-informata, euristica-h, greedy-best-first, a-star, ammissibile, consistente, dominanza.

**CSP:** csp, soluzione-csp, backtracking, backjumping, forward-checking, propagazione,
arc-consistency, ac-3, k-consistency, esempio-mappa/n-regine.

**GA Giochi:** giochi (det/stoc, somma-zero), funzione-di-valutazione, minimax,
potatura-alfa-beta, expectiminimax.

**PL Logica proposizionale:** logica-proposizionale, modello, tautologia, soddisfacibile,
contraddizione, entailment, correttezza, completezza, kb-consistente, formula-atomica,
letterale, clausola, clausola-horn, cnf, modus-ponens, forward-chaining, backward-chaining,
risoluzione, refutazione.

**FOL:** fol, quantificatori, costanti-variabili, predicati, funzioni, ground, lifting,
unificazione, mgu, skolemizzazione, inferenza.

**KR Ontologie:** tassonomia, ontologia, isa-vs-member, disjoint, decomposizione-esaustiva,
partition, semantic-web, rdf, owl, part-of, bunch-of, assiomatizzazione, allineamento-ontologie.

**ML Apprendimento:** supervisionato, non-supervisionato, auto-supervisionato, classificazione,
attributi, albero-decisione, algoritmo-hunt, information-gain, gini, entropia, pruning,
overfitting, underfitting, bias-modello, varianza, rasoio-occam, mdl, rote-learning-knn,
matrice-costi, matrice-confusione, accuratezza, training-test-set, cross-validation.

**NN Reti neurali:** perceptron, problema-xor, reti-neurali, mlp, epoca, gradiente,
backpropagation, cnn, rnn, autoencoder.

**GEN IA generativa:** ia-generativa, gan, addestramento-avversariale, modelli-diffusione,
clustering, k-means.

**NLP Transformer:** language-model, assunzione-markov, naive-bayes, one-hot, tf-idf,
embeddings, transformer, attention, encoder-decoder, masking, residual-connections,
grounding, bias-dati.

**PR Probabilità:** probabilita-var-aleatorie, teorema-bayes, indipendenza-condizionata,
reti-bayesiane, cpt.

**PLAN Planning:** planning, pddl, situation-calculus, fluenti, assiomi-planning,
frame-problem, anomalia-sussman.

(~110 nodi. Blurb scritti freschi dagli appunti in fase di implementazione.)

## Visualizzazioni (toolbar in alto)

La **stessa rete** (stessi nodi/archi), 5 funzioni di posizionamento:

1. **Force-directed** (default): mini simulazione a molle/repulsione, drag dei nodi.
2. **Rete di Bayes (DAG)**: layout gerarchico top-down per livelli, archi `prereq` come frecce.
3. **MLP a layer**: nodi in colonne (layer) per profondità di dipendenza.
4. **Albero di decisione**: gerarchia radicata top-down (sottoinsieme con radice scelta).
5. **Tassonomia IS-A**: albero ontologico costruito sugli archi `isa`.

Transizione animata delle posizioni nel passaggio da un layout all'altro.

## Interazione nodo + ricerca testuale

- Click su nodo → **pannello laterale**: titolo, categoria, blurb, vicini cliccabili,
  link "approfondisci" alla flashcard (se presente).
- **Search box**: cerca/seleziona un topic per label → evidenzia e centra il nodo.

## PoC ricerca (cuore interattivo)

Pannello dedicato: scegli **start**, **goal**, **algoritmo**, poi *Play / Step / Reset*.
Anima passo-passo con legenda colori: nodo corrente, in frontiera, visitato, cammino finale.

- **Cieca:** BFS (frontiera FIFO), DFS (LIFO), IDS (DFS a profondità crescente),
  UCS (espande g(n) minimo).
- **Informata:** Greedy (solo h(n)), A* (f=g+h). Mostra g/h/f sul nodo espanso.
- **Euristica h(n)** = distanza euclidea dal goal nelle coordinate del layout corrente
  (rende concreto "l'euristica stima la distanza dal goal"). Costi archi: 1 di default.

Il grafo è non orientato per la ricerca (si naviga sui collegamenti); le frecce
restano solo indicatore visivo di dipendenza.

## Componenti (unità isolate)

- `graph-data.js`: solo dati, nessuna logica.
- `layout.*` (in grafo.js): funzioni pure `posizioni(nodi, archi) -> {id:{x,y}}` per i 5 layout.
- `render.*`: disegna SVG da nodi+posizioni+stato evidenziazione.
- `search.*`: generatori passo-passo per i 6 algoritmi, indipendenti dal render.
- `ui.*`: toolbar, pannello nodo, pannello ricerca, theme.

## Fuori scope (YAGNI)

- Niente editing del grafo da UI, niente persistenza server, niente librerie grafo esterne.
- Niente esecuzione reale degli algoritmi ML (è una mappa concettuale + PoC di ricerca, non un trainer).
