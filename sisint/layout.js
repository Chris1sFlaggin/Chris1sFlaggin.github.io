/* SISINT Made Easy — funzioni di layout pure: (nodes, edges, vp[, root]) -> {id:{x,y}}.
   vp = { w, h }. Le funzioni non mutano gli input e sono deterministiche. */

const MARGIN = 60;

function dirEdges(edges) {
  return edges.filter(e => e.type === 'prereq' || e.type === 'isa');
}

// livello = lunghezza del cammino più lungo nel sotto-grafo diretto (prereq/isa)
function computeLevels(nodes, edges) {
  const lvl = {};
  for (const n of nodes) lvl[n.id] = 0;
  const de = dirEdges(edges);
  for (let it = 0; it < nodes.length; it++) {
    let changed = false;
    for (const e of de) {
      if (lvl[e.t] < lvl[e.s] + 1) { lvl[e.t] = lvl[e.s] + 1; changed = true; }
    }
    if (!changed) break;
  }
  return lvl;
}

// raggruppa gli id per livello e assegna una posizione "trasversale" uniforme
function placeByLevel(nodes, lvl) {
  const byLevel = {};
  for (const n of nodes) (byLevel[lvl[n.id]] ||= []).push(n.id);
  const maxLevel = Math.max(0, ...Object.keys(byLevel).map(Number));
  return { byLevel, maxLevel };
}

function dagLayout(nodes, edges, vp) {
  const lvl = computeLevels(nodes, edges);
  const { byLevel, maxLevel } = placeByLevel(nodes, lvl);
  const pos = {};
  const gapY = (vp.h - 2 * MARGIN) / Math.max(1, maxLevel);
  for (const lv in byLevel) {
    const ids = byLevel[lv];
    ids.forEach((id, i) => {
      pos[id] = {
        x: MARGIN + (vp.w - 2 * MARGIN) * (i + 1) / (ids.length + 1),
        y: MARGIN + gapY * Number(lv)
      };
    });
  }
  return pos;
}

function mlpLayout(nodes, edges, vp) {
  const lvl = computeLevels(nodes, edges);
  const { byLevel, maxLevel } = placeByLevel(nodes, lvl);
  const pos = {};
  const gapX = (vp.w - 2 * MARGIN) / Math.max(1, maxLevel);
  for (const lv in byLevel) {
    const ids = byLevel[lv];
    ids.forEach((id, i) => {
      pos[id] = {
        x: MARGIN + gapX * Number(lv),
        y: MARGIN + (vp.h - 2 * MARGIN) * (i + 1) / (ids.length + 1)
      };
    });
  }
  return pos;
}

function isaLayout(nodes, edges, vp) {
  // come il DAG ma considerando solo gli archi isa (gerarchia tassonomica)
  const isaEdges = edges.filter(e => e.type === 'isa');
  const lvl = {};
  for (const n of nodes) lvl[n.id] = 0;
  for (let it = 0; it < nodes.length; it++) {
    let changed = false;
    for (const e of isaEdges) if (lvl[e.t] < lvl[e.s] + 1) { lvl[e.t] = lvl[e.s] + 1; changed = true; }
    if (!changed) break;
  }
  const { byLevel, maxLevel } = placeByLevel(nodes, lvl);
  const pos = {};
  const gapY = (vp.h - 2 * MARGIN) / Math.max(1, maxLevel);
  for (const lv in byLevel) {
    const ids = byLevel[lv];
    ids.forEach((id, i) => {
      pos[id] = {
        x: MARGIN + (vp.w - 2 * MARGIN) * (i + 1) / (ids.length + 1),
        y: MARGIN + gapY * Number(lv)
      };
    });
  }
  return pos;
}

function treeLayout(nodes, edges, vp, root) {
  const de = dirEdges(edges);
  const children = {};
  for (const e of de) (children[e.s] ||= []).push(e.t);
  const rootId = root || (nodes[0] && nodes[0].id);
  // BFS dalla radice → profondità (primo padre vince)
  const depth = {};
  const order = [];
  const seen = new Set();
  const q = [[rootId, 0]];
  while (q.length) {
    const [id, d] = q.shift();
    if (seen.has(id)) continue;
    seen.add(id); depth[id] = d; order.push(id);
    for (const c of children[id] || []) if (!seen.has(c)) q.push([c, d + 1]);
  }
  // nodi non raggiungibili dalla radice: in una banda extra in fondo
  const maxReached = order.length ? Math.max(...order.map(id => depth[id])) : 0;
  for (const n of nodes) if (!seen.has(n.id)) { depth[n.id] = maxReached + 1; order.push(n.id); }
  const { byLevel, maxLevel } = placeByLevel(nodes, depth);
  const pos = {};
  const gapY = (vp.h - 2 * MARGIN) / Math.max(1, maxLevel);
  for (const lv in byLevel) {
    const ids = byLevel[lv];
    ids.forEach((id, i) => {
      pos[id] = {
        x: MARGIN + (vp.w - 2 * MARGIN) * (i + 1) / (ids.length + 1),
        y: MARGIN + gapY * Number(lv)
      };
    });
  }
  return pos;
}

// PRNG deterministico (mulberry32)
function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function forceLayout(nodes, edges, vp) {
  const rand = mulberry32((vp && vp.seed) || 1);
  const W = vp.w, H = vp.h;
  const pos = {};
  for (const n of nodes) pos[n.id] = { x: MARGIN + rand() * (W - 2 * MARGIN), y: MARGIN + rand() * (H - 2 * MARGIN) };
  const ids = nodes.map(n => n.id);
  const k = Math.sqrt((W * H) / Math.max(1, ids.length)); // distanza ideale
  const ITER = 200;
  for (let it = 0; it < ITER; it++) {
    const disp = {};
    for (const id of ids) disp[id] = { x: 0, y: 0 };
    // repulsione tra tutte le coppie
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        const a = pos[ids[i]], b = pos[ids[j]];
        let dx = a.x - b.x, dy = a.y - b.y;
        let dist = Math.sqrt(dx * dx + dy * dy) || 0.01;
        const force = (k * k) / dist;
        const fx = (dx / dist) * force, fy = (dy / dist) * force;
        disp[ids[i]].x += fx; disp[ids[i]].y += fy;
        disp[ids[j]].x -= fx; disp[ids[j]].y -= fy;
      }
    }
    // attrazione lungo gli archi
    for (const e of edges) {
      if (!pos[e.s] || !pos[e.t]) continue;
      const a = pos[e.s], b = pos[e.t];
      let dx = a.x - b.x, dy = a.y - b.y;
      let dist = Math.sqrt(dx * dx + dy * dy) || 0.01;
      const force = (dist * dist) / k;
      const fx = (dx / dist) * force, fy = (dy / dist) * force;
      disp[e.s].x -= fx; disp[e.s].y -= fy;
      disp[e.t].x += fx; disp[e.t].y += fy;
    }
    const temp = (1 - it / ITER) * (k * 0.6); // raffreddamento
    for (const id of ids) {
      const d = disp[id];
      const len = Math.sqrt(d.x * d.x + d.y * d.y) || 0.01;
      pos[id].x += (d.x / len) * Math.min(len, temp);
      pos[id].y += (d.y / len) * Math.min(len, temp);
      pos[id].x = Math.max(MARGIN, Math.min(W - MARGIN, pos[id].x));
      pos[id].y = Math.max(MARGIN, Math.min(H - MARGIN, pos[id].y));
    }
  }
  for (const id of ids) { pos[id].x = Math.round(pos[id].x); pos[id].y = Math.round(pos[id].y); }
  return pos;
}

const LAYOUT = { dagLayout, mlpLayout, isaLayout, treeLayout, forceLayout, computeLevels };

if (typeof module !== 'undefined' && module.exports) module.exports = LAYOUT;
if (typeof window !== 'undefined') window.LAYOUT = LAYOUT;
