/* SISINT Made Easy — algoritmi di ricerca come GENERATORI di passi.
   Ogni algoritmo: function*(graph, start, goal, opts) e yield-a per ogni espansione
     { current, frontier:[ids], visited:[ids], done:bool, path:[ids], g?, h?, f? }
   Il grafo è trattato come NON orientato (si naviga sui collegamenti).
   opts.h(id) = euristica (default 0);  opts.cost(a,b) = costo arco (default 1). */

function adjacency(graph) {
  const adj = new Map();
  for (const n of graph.nodes) adj.set(n.id, []);
  for (const e of graph.edges) {
    if (!adj.has(e.s)) adj.set(e.s, []);
    if (!adj.has(e.t)) adj.set(e.t, []);
    adj.get(e.s).push(e.t);
    adj.get(e.t).push(e.s);
  }
  return adj;
}

function reconstructPath(cameFrom, goal) {
  const path = [];
  let cur = goal;
  while (cur !== null && cur !== undefined) { path.unshift(cur); cur = cameFrom[cur]; }
  return path;
}

const noPath = visited => ({ current: null, frontier: [], visited: [...visited], done: true, path: [] });

// ---- ricerca cieca: BFS (FIFO) e DFS (LIFO) ----
function* frontierSearch(graph, start, goal, takeFromEnd) {
  const adj = adjacency(graph);
  const frontier = [[start, null]];        // [id, parent]
  const visited = new Set();
  const cameFrom = {};
  while (frontier.length) {
    const [current, parent] = takeFromEnd ? frontier.pop() : frontier.shift();
    if (visited.has(current)) continue;
    visited.add(current);
    cameFrom[current] = parent;
    if (current === goal) {
      yield { current, frontier: frontier.map(e => e[0]), visited: [...visited], done: true, path: reconstructPath(cameFrom, goal) };
      return;
    }
    for (const nb of adj.get(current) || []) {
      if (!visited.has(nb)) frontier.push([nb, current]);
    }
    yield { current, frontier: frontier.map(e => e[0]), visited: [...visited], done: false, path: [] };
  }
  yield noPath(visited);
}

function bfs(graph, start, goal) { return frontierSearch(graph, start, goal, false); }
function dfs(graph, start, goal) { return frontierSearch(graph, start, goal, true); }

// ---- best-first generico (UCS / Greedy / A*) ----
function* bestFirst(graph, start, goal, priority, opts) {
  opts = opts || {};
  const h = opts.h || (() => 0);
  const cost = opts.cost || (() => 1);
  const adj = adjacency(graph);
  const pq = [[start, null, 0]];           // [id, parent, g]
  const visited = new Set();
  const cameFrom = {};
  while (pq.length) {
    let mi = 0;
    for (let i = 1; i < pq.length; i++) if (priority(pq[i], h) < priority(pq[mi], h)) mi = i;
    const [current, parent, g] = pq.splice(mi, 1)[0];
    if (visited.has(current)) continue;
    visited.add(current);
    cameFrom[current] = parent;
    const info = { g, h: h(current), f: g + h(current) };
    if (current === goal) {
      yield { current, ...info, frontier: pq.map(e => e[0]), visited: [...visited], done: true, path: reconstructPath(cameFrom, goal) };
      return;
    }
    for (const nb of adj.get(current) || []) {
      if (!visited.has(nb)) pq.push([nb, current, g + cost(current, nb)]);
    }
    yield { current, ...info, frontier: pq.map(e => e[0]), visited: [...visited], done: false, path: [] };
  }
  yield noPath(visited);
}

function ucs(graph, start, goal, opts) { return bestFirst(graph, start, goal, e => e[2], opts); }
function greedy(graph, start, goal, opts) { return bestFirst(graph, start, goal, (e, h) => h(e[0]), opts); }
function astar(graph, start, goal, opts) { return bestFirst(graph, start, goal, (e, h) => e[2] + h(e[0]), opts); }

// ---- IDS: DFS a profondità limitata, limite crescente ----
function* ids(graph, start, goal) {
  const adj = adjacency(graph);
  const maxLimit = graph.nodes.length;
  for (let limit = 0; limit <= maxLimit; limit++) {
    const stack = [[start, null, 0]];      // [id, parent, depth]
    const visited = new Set();
    const cameFrom = {};
    while (stack.length) {
      const [current, parent, depth] = stack.pop();
      if (visited.has(current)) continue;
      visited.add(current);
      cameFrom[current] = parent;
      if (current === goal) {
        yield { current, limit, depth, frontier: stack.map(e => e[0]), visited: [...visited], done: true, path: reconstructPath(cameFrom, goal) };
        return;
      }
      if (depth < limit) {
        for (const nb of adj.get(current) || []) if (!visited.has(nb)) stack.push([nb, current, depth + 1]);
      }
      yield { current, limit, depth, frontier: stack.map(e => e[0]), visited: [...visited], done: false, path: [] };
    }
  }
  yield { current: null, frontier: [], visited: [], done: true, path: [] };
}

const SEARCH = { adjacency, reconstructPath, bfs, dfs, ucs, greedy, astar, ids };

if (typeof module !== 'undefined' && module.exports) module.exports = SEARCH;
if (typeof window !== 'undefined') window.SEARCH = SEARCH;
