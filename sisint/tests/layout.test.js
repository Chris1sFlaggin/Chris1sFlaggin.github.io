const test = require('node:test');
const assert = require('node:assert');
const L = require('../layout.js');

const nodes = [{ id: 'r' }, { id: 'a' }, { id: 'b' }, { id: 'c' }];
const edges = [
  { s: 'r', t: 'a', type: 'prereq' },
  { s: 'r', t: 'b', type: 'prereq' },
  { s: 'a', t: 'c', type: 'prereq' }
];
const vp = { w: 800, h: 600 };

function within(p) {
  for (const id in p) {
    assert.ok(p[id].x >= 0 && p[id].x <= vp.w, `${id}.x fuori viewport: ${p[id].x}`);
    assert.ok(p[id].y >= 0 && p[id].y <= vp.h, `${id}.y fuori viewport: ${p[id].y}`);
  }
}

test('dagLayout: i figli stanno sotto i padri (y crescente)', () => {
  const p = L.dagLayout(nodes, edges, vp);
  assert.ok(p.a.y > p.r.y);
  assert.ok(p.c.y > p.a.y);
  within(p);
});

test('mlpLayout: i layer avanzano in x', () => {
  const p = L.mlpLayout(nodes, edges, vp);
  assert.ok(p.a.x > p.r.x);
  assert.ok(p.c.x > p.a.x);
  within(p);
});

test('treeLayout: tutte le posizioni dentro la viewport', () => {
  const p = L.treeLayout(nodes, edges, vp, 'r');
  assert.strictEqual(Object.keys(p).length, nodes.length);
  within(p);
});

test('isaLayout: produce una posizione per ogni nodo dentro la viewport', () => {
  const isaNodes = [{ id: 'x' }, { id: 'y' }, { id: 'z' }];
  const isaEdges = [{ s: 'x', t: 'y', type: 'isa' }, { s: 'x', t: 'z', type: 'isa' }];
  const p = L.isaLayout(isaNodes, isaEdges, vp);
  assert.strictEqual(Object.keys(p).length, 3);
  for (const id in p) { assert.ok(typeof p[id].x === 'number' && typeof p[id].y === 'number'); }
});

test('forceLayout: deterministico con lo stesso seed', () => {
  const a = L.forceLayout(nodes, edges, { ...vp, seed: 1 });
  const b = L.forceLayout(nodes, edges, { ...vp, seed: 1 });
  assert.deepStrictEqual(a, b);
});

test('forceLayout: posizioni dentro la viewport', () => {
  within(L.forceLayout(nodes, edges, { ...vp, seed: 7 }));
});
