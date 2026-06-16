const test = require('node:test');
const assert = require('node:assert');
const S = require('../search.js');

// grafo: a-b-c-d (3 archi) + scorciatoia a-e-d (2 archi)
const g = {
  nodes: ['a', 'b', 'c', 'd', 'e'].map(id => ({ id })),
  edges: [
    { s: 'a', t: 'b' }, { s: 'b', t: 'c' }, { s: 'c', t: 'd' },
    { s: 'a', t: 'e' }, { s: 'e', t: 'd' }
  ]
};
const h = id => ({ a: 2, b: 2, c: 1, d: 0, e: 1 }[id]);

function run(gen) { let last; for (const step of gen) last = step; return last; }

test('BFS trova il cammino con meno archi', () => {
  const r = run(S.bfs(g, 'a', 'd'));
  assert.deepStrictEqual(r.path, ['a', 'e', 'd']);
  assert.strictEqual(r.done, true);
});

test('DFS trova un cammino valido a→d', () => {
  const r = run(S.dfs(g, 'a', 'd'));
  assert.strictEqual(r.path[0], 'a');
  assert.strictEqual(r.path.at(-1), 'd');
});

test('UCS con costi unitari = minimo numero archi', () => {
  const r = run(S.ucs(g, 'a', 'd'));
  assert.strictEqual(r.path.length, 3); // a,e,d
});

test('A* con h ammissibile trova l\'ottimo', () => {
  const r = run(S.astar(g, 'a', 'd', { h }));
  assert.strictEqual(r.path.length, 3);
  assert.strictEqual(r.path.at(-1), 'd');
});

test('IDS è completo: trova il goal', () => {
  const r = run(S.ids(g, 'a', 'd'));
  assert.strictEqual(r.path.at(-1), 'd');
});

test('Greedy raggiunge il goal', () => {
  const r = run(S.greedy(g, 'a', 'd', { h }));
  assert.strictEqual(r.path.at(-1), 'd');
});

test('gli step intermedi espongono frontiera e visitati', () => {
  const steps = [...S.bfs(g, 'a', 'd')];
  assert.ok(steps.length > 1);
  assert.ok(Array.isArray(steps[0].frontier));
  assert.ok(Array.isArray(steps[0].visited));
});

test('adjacency è non orientata', () => {
  const adj = S.adjacency(g);
  assert.ok(adj.get('d').includes('e'));
  assert.ok(adj.get('e').includes('d'));
});

test('goal irraggiungibile → path vuoto', () => {
  const g2 = { nodes: [{ id: 'x' }, { id: 'y' }], edges: [] };
  const r = run(S.bfs(g2, 'x', 'y'));
  assert.deepStrictEqual(r.path, []);
});
