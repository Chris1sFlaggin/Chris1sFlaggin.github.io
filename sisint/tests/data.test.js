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

test('ogni categoria di nodo esiste in GRAPH.cats', () => {
  const cats = new Set(Object.keys(GRAPH.cats));
  for (const n of GRAPH.nodes) {
    assert.ok(cats.has(n.cat), `categoria sconosciuta '${n.cat}' nel nodo ${n.id}`);
  }
});

test('archi: endpoint esistenti e tipo valido', () => {
  const ids = new Set(GRAPH.nodes.map(n => n.id));
  for (const e of GRAPH.edges) {
    assert.ok(ids.has(e.s), `arco da id inesistente: ${e.s}`);
    assert.ok(ids.has(e.t), `arco verso id inesistente: ${e.t}`);
    assert.ok(['prereq', 'isa', 'rel'].includes(e.type), `tipo arco non valido: ${e.type}`);
    assert.notStrictEqual(e.s, e.t, `self-loop su ${e.s}`);
  }
});

test('grafo connesso (nessun nodo isolato)', () => {
  const deg = Object.fromEntries(GRAPH.nodes.map(n => [n.id, 0]));
  for (const e of GRAPH.edges) { deg[e.s]++; deg[e.t]++; }
  const isolated = Object.entries(deg).filter(([, d]) => d === 0).map(([id]) => id);
  assert.deepStrictEqual(isolated, [], `nodi isolati: ${isolated.join(', ')}`);
});
