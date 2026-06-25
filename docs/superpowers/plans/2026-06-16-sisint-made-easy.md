# SISINT Made Easy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Pagina interattiva che mostra tutti gli appunti SISINT come grafo di concetti, visualizzabile in 5 layout (force / Bayes-DAG / MLP / albero decisione / tassonomia IS-A), con click-per-spiegazione e PoC animato dei 6 algoritmi di ricerca (BFS/DFS/IDS/UCS/Greedy/A*).

**Architecture:** Static, vanilla JS + SVG, zero build. Logica pura (dati grafo + algoritmi di ricerca) in moduli con guard `module.exports` così sono testabili headless con `node --test`. Render/UI nel browser. Riuso variabili CSS del sito.

**Tech Stack:** HTML, CSS (var di `sisint/style.css`), JavaScript vanilla, SVG. Test: `node:assert` + `node:test` (già in Node, nessuna dipendenza).

---

### Task 1: Dati del grafo (`graph-data.js`)

**Files:**
- Create: `sisint/graph-data.js`
- Test: `sisint/tests/data.test.js`

Definisce `GRAPH = { nodes:[...], edges:[...] }`, ~110 nodi dall'inventario nello spec, con
`{id,label,cat,blurb,flash?}` e archi `{s,t,type}` (`prereq|isa|rel`). Chiude con guard:
`if (typeof module!=='undefined') module.exports = GRAPH;` e in browser resta globale `window.GRAPH`.

- [ ] **Step 1: Scrivi il test di integrità (fallisce)**

```js
// sisint/tests/data.test.js
const test = require('node:test');
const assert = require('node:assert');
const GRAPH = require('../graph-data.js');

test('nodi: id unici, campi obbligatori', () => {
  const ids = new Set();
  for (const n of GRAPH.nodes) {
    assert.ok(n.id && n.label && n.cat && n.blurb, `nodo incompleto: ${JSON.stringify(n)}`);
    assert.ok(!ids.has(n.id), `id duplicato: ${n.id}`);
    ids.add(n.id);
  }
  assert.ok(GRAPH.nodes.length >= 100, `attesi >=100 nodi, trovati ${GRAPH.nodes.length}`);
});

test('archi: endpoint esistenti e tipo valido', () => {
  const ids = new Set(GRAPH.nodes.map(n => n.id));
  for (const e of GRAPH.edges) {
    assert.ok(ids.has(e.s), `arco da id inesistente: ${e.s}`);
    assert.ok(ids.has(e.t), `arco verso id inesistente: ${e.t}`);
    assert.ok(['prereq','isa','rel'].includes(e.type), `tipo arco non valido: ${e.type}`);
  }
});

test('grafo connesso (nessun nodo isolato)', () => {
  const deg = Object.fromEntries(GRAPH.nodes.map(n => [n.id, 0]));
  for (const e of GRAPH.edges) { deg[e.s]++; deg[e.t]++; }
  const isolated = Object.entries(deg).filter(([,d]) => d === 0).map(([id]) => id);
  assert.deepStrictEqual(isolated, [], `nodi isolati: ${isolated.join(', ')}`);
});
```

- [ ] **Step 2: Esegui, verifica fallimento** — `node --test sisint/tests/` → FAIL (modulo mancante).
- [ ] **Step 3: Crea `graph-data.js`** con tutti i nodi/archi dall'inventario dello spec (blurb freschi, italiano "made easy"). Categorie: AG/SE/CSP/GA/PL/FOL/KR/ML/NN/GEN/NLP/PR/PLAN.
- [ ] **Step 4: Esegui i test** — `node --test sisint/tests/` → PASS.

---

### Task 2: Algoritmi di ricerca (`search.js`)

**Files:**
- Create: `sisint/search.js`
- Test: `sisint/tests/search.test.js`

Ogni algoritmo è un **generatore di passi** `function*(graph, start, goal, opts)` che yield-a
`{current, frontier:[...], visited:[...], done, path:[...]}`. Adiacenza non orientata costruita dagli archi.
`h(n)` passata via `opts.h` (coords-based nel browser; per test una `h` esplicita). Export con guard.
Algoritmi: `bfs, dfs, ids, ucs, greedy, astar` + helper `adjacency(graph)`, `reconstructPath`.

- [ ] **Step 1: Test correttezza (fallisce)**

```js
// sisint/tests/search.test.js
const test = require('node:test');
const assert = require('node:assert');
const S = require('../search.js');

// grafo lineare a-b-c-d + scorciatoia a-d con peso alto via nodo e
const g = { nodes:['a','b','c','d','e'].map(id=>({id})),
  edges:[{s:'a',t:'b'},{s:'b',t:'c'},{s:'c',t:'d'},{s:'a',t:'e'},{s:'e',t:'d'}] };

function run(gen){ let last; for (const step of gen) last=step; return last; }

test('BFS trova cammino minimo in archi', () => {
  const r = run(S.bfs(g,'a','d'));
  assert.deepStrictEqual(r.path, ['a','e','d']); // 2 archi
});
test('DFS trova un cammino valido', () => {
  const r = run(S.dfs(g,'a','d'));
  assert.strictEqual(r.path[0],'a'); assert.strictEqual(r.path.at(-1),'d');
});
test('UCS con costi unitari = minimo archi', () => {
  const r = run(S.ucs(g,'a','d'));
  assert.strictEqual(r.path.length, 3);
});
test('A* con h ammissibile trova ottimo', () => {
  const h = id => ({a:2,b:2,c:1,d:0,e:1}[id]);
  const r = run(S.astar(g,'a','d',{h}));
  assert.strictEqual(r.path.length, 3);
});
test('IDS completo trova il goal', () => {
  const r = run(S.ids(g,'a','d'));
  assert.strictEqual(r.path.at(-1),'d');
});
test('Greedy raggiunge il goal', () => {
  const h = id => ({a:2,b:2,c:1,d:0,e:1}[id]);
  const r = run(S.greedy(g,'a','d',{h}));
  assert.strictEqual(r.path.at(-1),'d');
});
test('step intermedi espongono frontiera/visited', () => {
  const steps=[...S.bfs(g,'a','d')];
  assert.ok(steps.length>1);
  assert.ok(Array.isArray(steps[0].frontier) && Array.isArray(steps[0].visited));
});
```

- [ ] **Step 2: Esegui, verifica fallimento** → FAIL.
- [ ] **Step 3: Implementa `search.js`** (6 generatori + helper, export guard).
- [ ] **Step 4: Esegui** → tutti PASS.

---

### Task 3: Layout (`layout.js`)

**Files:**
- Create: `sisint/layout.js`
- Test: `sisint/tests/layout.test.js`

Funzioni pure `name(nodes, edges, {w,h}) -> {id:{x,y}}`:
`forceLayout` (sim a molle deterministica con seed), `dagLayout` (livelli per profondità su archi `prereq`),
`mlpLayout` (colonne per profondità), `treeLayout(rootId)` (albero radicato), `isaLayout` (albero su archi `isa`).
Export con guard. Test sui layout deterministici (dag/tree/isa).

- [ ] **Step 1: Test (fallisce)**

```js
// sisint/tests/layout.test.js
const test=require('node:test'); const assert=require('node:assert');
const L=require('../layout.js');
const nodes=[{id:'r'},{id:'a'},{id:'b'},{id:'c'}];
const edges=[{s:'r',t:'a',type:'prereq'},{s:'r',t:'b',type:'prereq'},{s:'a',t:'c',type:'prereq'}];

test('dagLayout: figli sotto i padri (y crescente)', () => {
  const p=L.dagLayout(nodes,edges,{w:800,h:600});
  assert.ok(p.a.y>p.r.y); assert.ok(p.c.y>p.a.y);
});
test('treeLayout: tutte le posizioni dentro la viewport', () => {
  const p=L.treeLayout(nodes,edges,{w:800,h:600},'r');
  for(const id in p){ assert.ok(p[id].x>=0&&p[id].x<=800); assert.ok(p[id].y>=0&&p[id].y<=600); }
});
test('forceLayout: deterministico con stesso seed', () => {
  const a=L.forceLayout(nodes,edges,{w:800,h:600,seed:1});
  const b=L.forceLayout(nodes,edges,{w:800,h:600,seed:1});
  assert.deepStrictEqual(a,b);
});
```

- [ ] **Step 2: Esegui** → FAIL.
- [ ] **Step 3: Implementa `layout.js`**.
- [ ] **Step 4: Esegui** → PASS.

---

### Task 4: Pagina + render SVG (`grafo.html`, `grafo.css`, render in `grafo.js`)

**Files:**
- Create: `sisint/grafo.html`, `sisint/grafo.css`, `sisint/grafo.js`

`grafo.html`: header (titolo + theme toggle come gli altri file sisint), toolbar layout (5 bottoni),
search box, `<svg id="canvas">`, pannello laterale nodo, pannello ricerca. Carica
`style.css, grafo.css, graph-data.js, search.js, layout.js, grafo.js`.
`grafo.js` render: disegna archi (`<line>`/`<path>` con marker freccia per `prereq`/`isa`),
nodi (`<g>` cerchio+label, colore per `cat`), applica layout scelto, transizione posizioni, drag (force), zoom/pan.

- [ ] **Step 1:** Crea `grafo.html` + `grafo.css` (riusa `:root` var, layout responsive: canvas a sinistra, pannello a destra).
- [ ] **Step 2:** Implementa render SVG in `grafo.js` (nodi/archi/legenda categorie) + theme toggle + zoom/pan.
- [ ] **Step 3:** Collega i 5 bottoni layout → ricalcola posizioni con transizione.
- [ ] **Step 4 (verifica manuale, browser):** `cd /home/chris/Desktop/Chris1sFlaggin.github.io && bundle exec jekyll serve` (o apri il file). Controlla: grafo visibile, 5 layout cambiano disposizione, drag/zoom ok, tema dark/light ok. Console senza errori.

---

### Task 5: Interazione nodo + ricerca testuale (`grafo.js`)

**Files:**
- Modify: `sisint/grafo.js`, `sisint/grafo.html`, `sisint/grafo.css`

- [ ] **Step 1:** Click nodo → pannello laterale: titolo, badge categoria, blurb, lista vicini cliccabili, link "approfondisci" a `flashcards.html` se `flash` presente. Hover → evidenzia vicini.
- [ ] **Step 2:** Search box: input con datalist dei label → seleziona/centra/evidenzia il nodo, apre il pannello.
- [ ] **Step 3 (verifica manuale):** click su vari nodi mostra spiegazione corretta; ricerca "A*" centra e apre il nodo; navigazione vicini funziona.

---

### Task 6: PoC ricerca animata (`grafo.js`)

**Files:**
- Modify: `sisint/grafo.js`, `sisint/grafo.html`, `sisint/grafo.css`

- [ ] **Step 1:** Pannello ricerca: select start, select goal, select algoritmo (BFS/DFS/IDS/UCS/Greedy/A*), bottoni Play/Step/Reset, slider velocità.
- [ ] **Step 2:** Esegue il generatore dell'algoritmo scelto (da `search.js`); `h(n)` = distanza euclidea dalle coords correnti al goal. Colora i nodi per stato (corrente/frontiera/visitato/cammino) + legenda; mostra g/h/f sul nodo corrente per Greedy/A*.
- [ ] **Step 3:** Play anima con timer; Step avanza di uno; Reset pulisce.
- [ ] **Step 4 (verifica manuale):** ogni algoritmo anima frontiera/visitati e trova il cammino; BFS vs DFS visibilmente diversi; A* mostra g/h/f.

---

### Task 7: Integrazione nel sito

**Files:**
- Modify: `sisint/index.html`

- [ ] **Step 1:** Aggiungi una card "🕸️ SISINT Made Easy — mappa interattiva dei concetti" in cima a `index.html` (stesso stile delle card esistenti) che linka a `grafo.html`.
- [ ] **Step 2 (verifica manuale):** dalla home sisint la card porta alla pagina del grafo.
- [ ] **Step 3:** Esegui tutti i test logici un'ultima volta: `node --test sisint/tests/` → tutti PASS.

---

## Note implementazione

- `.gitignore` di sisint: verificare che `tests/` e i nuovi file non siano esclusi.
- Nessun commit automatico: l'utente committa manualmente (commit solo se richiesto).
- DRY: adiacenza e helper coords condivisi tra `search.js` e `grafo.js` via funzioni esportate.
