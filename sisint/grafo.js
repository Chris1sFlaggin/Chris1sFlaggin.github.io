/* SISINT Made Easy — render SVG + layout + interazione + PoC ricerca. Vanilla JS. */
'use strict';
(function () {
  const SVGNS = 'http://www.w3.org/2000/svg';
  const VP = { w: 1700, h: 1100 };        // spazio logico del layout
  const G = window.GRAPH, LAY = window.LAYOUT, SR = window.SEARCH;

  const el = id => document.getElementById(id);
  const nodeById = Object.fromEntries(G.nodes.map(n => [n.id, n]));
  const adj = SR.adjacency(G);

  const dom = {
    svg: el('canvas'), viewport: el('viewport'), edgesLayer: el('edges-layer'), nodesLayer: el('nodes-layer'),
    panel: el('node-panel'), legend: el('legend'),
    search: el('node-search'), datalist: el('node-list'),
    pocStart: el('poc-start'), pocGoal: el('poc-goal'), pocAlgo: el('poc-algo'),
    pocSpeed: el('poc-speed'), pocStatus: el('poc-status')
  };

  const state = {
    layout: 'force',
    pos: {},                 // id -> {x,y} (correnti, animate)
    nodeEls: {},             // id -> <g>
    edgeEls: [],             // {line, s, t}
    selected: null,
    catFilter: null,         // categoria evidenziata dalla legenda
    view: { x: 0, y: 0, k: 1 },
    layouts: {},             // cache posizioni per layout
    poc: { steps: [], idx: -1, timer: null }
  };

  // ============ LAYOUT ============
  function computeLayout(name) {
    if (state.layouts[name]) return state.layouts[name];
    let p;
    if (name === 'force') p = LAY.forceLayout(G.nodes, G.edges, { w: VP.w, h: VP.h, seed: 42 });
    else if (name === 'dag') p = LAY.dagLayout(G.nodes, G.edges, VP);
    else if (name === 'mlp') p = LAY.mlpLayout(G.nodes, G.edges, VP);
    else if (name === 'tree') p = LAY.treeLayout(G.nodes, G.edges, VP, 'agente');
    else if (name === 'isa') p = LAY.isaLayout(G.nodes, G.edges, VP);
    state.layouts[name] = p;
    return p;
  }

  function setLayout(name, animate) {
    state.layout = name;
    document.querySelectorAll('.mz-lay').forEach(b => b.classList.toggle('active', b.dataset.layout === name));
    resetPoc();
    const target = computeLayout(name);
    if (!animate || !Object.keys(state.pos).length) {
      state.pos = deepCopy(target); positionAll(); fitToView(); return;
    }
    animatePositions(target);
  }

  function animatePositions(target) {
    const from = deepCopy(state.pos);
    const t0 = performance.now(), dur = 650;
    const ease = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    function frame(now) {
      const t = Math.min(1, (now - t0) / dur), e = ease(t);
      for (const id in target) {
        const a = from[id] || target[id], b = target[id];
        state.pos[id] = { x: a.x + (b.x - a.x) * e, y: a.y + (b.y - a.y) * e };
      }
      positionAll();
      if (t < 1) requestAnimationFrame(frame); else { state.pos = deepCopy(target); positionAll(); }
    }
    fitToView(target);
    requestAnimationFrame(frame);
  }

  // ============ RENDER (build once) ============
  function buildGraph() {
    for (const e of G.edges) {
      const line = document.createElementNS(SVGNS, 'line');
      line.setAttribute('class', 'mz-edge t-' + e.type);
      if (e.type === 'prereq') line.setAttribute('marker-end', 'url(#arrow-prereq)');
      if (e.type === 'isa') line.setAttribute('marker-end', 'url(#arrow-isa)');
      dom.edgesLayer.appendChild(line);
      state.edgeEls.push({ line, s: e.s, t: e.t, type: e.type });
    }
    for (const n of G.nodes) {
      const g = document.createElementNS(SVGNS, 'g');
      g.setAttribute('class', 'mz-node'); g.dataset.id = n.id;
      const c = document.createElementNS(SVGNS, 'circle');
      c.setAttribute('r', '8');
      c.setAttribute('fill', G.cats[n.cat].color);
      const tx = document.createElementNS(SVGNS, 'text');
      tx.setAttribute('y', '17'); tx.textContent = n.label;
      g.appendChild(c); g.appendChild(tx);
      bindNode(g, n.id);
      dom.nodesLayer.appendChild(g);
      state.nodeEls[n.id] = g;
    }
  }

  function positionAll() {
    for (const id in state.nodeEls) {
      const p = state.pos[id]; if (!p) continue;
      state.nodeEls[id].setAttribute('transform', `translate(${p.x},${p.y})`);
    }
    for (const e of state.edgeEls) {
      const a = state.pos[e.s], b = state.pos[e.t]; if (!a || !b) continue;
      e.line.setAttribute('x1', a.x); e.line.setAttribute('y1', a.y);
      e.line.setAttribute('x2', b.x); e.line.setAttribute('y2', b.y);
    }
  }

  // ============ VIEW: zoom / pan / fit ============
  function applyView() {
    const v = state.view;
    dom.viewport.setAttribute('transform', `translate(${v.x},${v.y}) scale(${v.k})`);
  }
  function fitToView(posMaybe) {
    const pos = posMaybe || state.pos;
    const ids = Object.keys(pos); if (!ids.length) return;
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const id of ids) { const p = pos[id]; minX = Math.min(minX, p.x); minY = Math.min(minY, p.y); maxX = Math.max(maxX, p.x); maxY = Math.max(maxY, p.y); }
    const pad = 60, w = (maxX - minX) || 1, h = (maxY - minY) || 1;
    const sw = dom.svg.clientWidth, sh = dom.svg.clientHeight;
    const k = Math.min((sw - 2 * pad) / w, (sh - 2 * pad) / h, 1.6);
    state.view.k = k;
    state.view.x = (sw - k * (minX + maxX)) / 2;
    state.view.y = (sh - k * (minY + maxY)) / 2;
    applyView();
  }
  function centerOn(id, zoom) {
    const p = state.pos[id]; if (!p) return;
    const sw = dom.svg.clientWidth, sh = dom.svg.clientHeight;
    state.view.k = zoom || Math.max(state.view.k, 1.1);
    state.view.x = sw / 2 - state.view.k * p.x;
    state.view.y = sh / 2 - state.view.k * p.y;
    dom.viewport.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1)';
    applyView();
    setTimeout(() => { dom.viewport.style.transition = ''; }, 520);
  }

  function bindView() {
    dom.svg.addEventListener('wheel', ev => {
      ev.preventDefault();
      const r = dom.svg.getBoundingClientRect();
      const cx = ev.clientX - r.left, cy = ev.clientY - r.top;
      const f = ev.deltaY < 0 ? 1.12 : 1 / 1.12;
      const nk = Math.max(0.2, Math.min(4, state.view.k * f));
      const real = nk / state.view.k;
      state.view.x = cx - real * (cx - state.view.x);
      state.view.y = cy - real * (cy - state.view.y);
      state.view.k = nk; applyView();
    }, { passive: false });

    let panning = false, sx = 0, sy = 0, vx0 = 0, vy0 = 0;
    dom.svg.addEventListener('pointerdown', ev => {
      if (ev.target.closest('.mz-node')) return;   // i nodi hanno il proprio handler
      panning = true; sx = ev.clientX; sy = ev.clientY; vx0 = state.view.x; vy0 = state.view.y;
      dom.svg.classList.add('grabbing'); dom.svg.setPointerCapture(ev.pointerId);
    });
    dom.svg.addEventListener('pointermove', ev => {
      if (!panning) return;
      state.view.x = vx0 + (ev.clientX - sx); state.view.y = vy0 + (ev.clientY - sy); applyView();
    });
    const stop = () => { panning = false; dom.svg.classList.remove('grabbing'); };
    dom.svg.addEventListener('pointerup', stop);
    dom.svg.addEventListener('pointercancel', stop);
  }

  // ============ NODE interaction ============
  function bindNode(g, id) {
    let moved = false, dragging = false, sx = 0, sy = 0;
    g.addEventListener('pointerdown', ev => {
      ev.stopPropagation(); moved = false; sx = ev.clientX; sy = ev.clientY;
      dragging = (state.layout === 'force');
      g.setPointerCapture(ev.pointerId);
    });
    g.addEventListener('pointermove', ev => {
      if (Math.abs(ev.clientX - sx) + Math.abs(ev.clientY - sy) > 4) moved = true;
      if (!dragging || !moved) return;
      const p = state.pos[id];
      p.x += (ev.clientX - sx) / state.view.k; p.y += (ev.clientY - sy) / state.view.k;
      sx = ev.clientX; sy = ev.clientY;
      g.setAttribute('transform', `translate(${p.x},${p.y})`);
      for (const e of state.edgeEls) {
        if (e.s === id) { e.line.setAttribute('x1', p.x); e.line.setAttribute('y1', p.y); }
        if (e.t === id) { e.line.setAttribute('x2', p.x); e.line.setAttribute('y2', p.y); }
      }
    });
    g.addEventListener('pointerup', ev => {
      g.releasePointerCapture(ev.pointerId);
      if (!moved) selectNode(id);
    });
    g.addEventListener('mouseenter', () => highlightNeighbors(id, true));
    g.addEventListener('mouseleave', () => { if (state.selected !== id) highlightNeighbors(null, false); });
  }

  function neighborsOf(id) {
    return [...new Set(adj.get(id) || [])];
  }

  function highlightNeighbors(id, on) {
    if (!on || !id) {
      if (state.selected) { highlightNeighbors(state.selected, true); return; }
      for (const nid in state.nodeEls) state.nodeEls[nid].classList.remove('dim');
      state.edgeEls.forEach(e => e.line.classList.remove('dim', 'hl'));
      applyCatFilter();
      return;
    }
    const keep = new Set([id, ...neighborsOf(id)]);
    for (const nid in state.nodeEls) state.nodeEls[nid].classList.toggle('dim', !keep.has(nid));
    state.edgeEls.forEach(e => {
      const touch = (e.s === id || e.t === id);
      e.line.classList.toggle('hl', touch);
      e.line.classList.toggle('dim', !touch);
    });
  }

  function selectNode(id) {
    state.selected = id;
    for (const nid in state.nodeEls) state.nodeEls[nid].classList.toggle('sel', nid === id);
    highlightNeighbors(id, true);
    openPanel(id);
  }

  function openPanel(id) {
    const n = nodeById[id];
    el('panel-cat').textContent = G.cats[n.cat].label;
    el('panel-cat').style.background = G.cats[n.cat].color;
    el('panel-title').textContent = n.label;
    el('panel-blurb').textContent = n.blurb;
    const nb = el('panel-neighbors'); nb.innerHTML = '';
    for (const m of neighborsOf(id)) {
      const b = document.createElement('button');
      b.className = 'mz-nb';
      b.innerHTML = `<span class="nbdot" style="background:${G.cats[nodeById[m].cat].color}"></span>${nodeById[m].label}`;
      b.onclick = () => { selectNode(m); centerOn(m); };
      nb.appendChild(b);
    }
    el('panel-flash').href = 'flashcards.html';
    dom.panel.hidden = false;
  }
  function closePanel() {
    dom.panel.hidden = true; state.selected = null;
    for (const nid in state.nodeEls) state.nodeEls[nid].classList.remove('sel');
    highlightNeighbors(null, false);
  }

  // ============ LEGEND + category filter ============
  function buildLegend() {
    dom.legend.innerHTML = '';
    for (const key in G.cats) {
      const c = G.cats[key];
      const s = document.createElement('span');
      s.className = 'lg'; s.title = 'Evidenzia ' + c.label;
      s.innerHTML = `<span class="dot" style="background:${c.color}"></span>${c.label}`;
      s.style.cursor = 'pointer';
      s.onclick = () => { state.catFilter = (state.catFilter === key) ? null : key; applyCatFilter(); };
      dom.legend.appendChild(s);
    }
  }
  function applyCatFilter() {
    const f = state.catFilter;
    for (const nid in state.nodeEls) {
      state.nodeEls[nid].classList.toggle('dim', !!f && nodeById[nid].cat !== f);
    }
    state.edgeEls.forEach(e => {
      const show = !f || (nodeById[e.s].cat === f && nodeById[e.t].cat === f);
      e.line.classList.toggle('dim', !show);
    });
  }

  // ============ SEARCH box ============
  function buildSearchList() {
    const sorted = [...G.nodes].sort((a, b) => a.label.localeCompare(b.label, 'it'));
    for (const n of sorted) {
      const o = document.createElement('option'); o.value = n.label; dom.datalist.appendChild(o);
    }
    const labelToId = Object.fromEntries(G.nodes.map(n => [n.label.toLowerCase(), n.id]));
    function go() {
      const q = dom.search.value.trim().toLowerCase(); if (!q) return;
      let id = labelToId[q] || G.nodes.find(n => n.label.toLowerCase().includes(q))?.id;
      if (id) { selectNode(id); centerOn(id, 1.3); }
    }
    dom.search.addEventListener('change', go);
    dom.search.addEventListener('keydown', ev => { if (ev.key === 'Enter') go(); });
  }

  // ============ PoC ricerca ============
  function buildPocSelects() {
    const sorted = [...G.nodes].sort((a, b) => a.label.localeCompare(b.label, 'it'));
    for (const sel of [dom.pocStart, dom.pocGoal]) {
      for (const n of sorted) { const o = document.createElement('option'); o.value = n.id; o.textContent = n.label; sel.appendChild(o); }
    }
    dom.pocStart.value = 'agente';
    dom.pocGoal.value = 'a_star';
  }

  function heuristicFor(goal) {
    // h(n) = distanza euclidea nel layout corrente, normalizzata alla lunghezza tipica di arco (≈ numero di hop)
    const lens = state.edgeEls.map(e => {
      const a = state.pos[e.s], b = state.pos[e.t];
      return Math.hypot(a.x - b.x, a.y - b.y);
    }).sort((x, y) => x - y);
    const unit = lens.length ? lens[Math.floor(lens.length / 2)] : 1;
    const gp = state.pos[goal];
    return id => { const p = state.pos[id]; return Math.hypot(p.x - gp.x, p.y - gp.y) / (unit || 1); };
  }

  function resetPoc() {
    if (state.poc.timer) { clearInterval(state.poc.timer); state.poc.timer = null; }
    state.poc.steps = []; state.poc.idx = -1;
    for (const nid in state.nodeEls) state.nodeEls[nid].classList.remove('s-visited', 's-frontier', 's-current', 's-path');
    state.edgeEls.forEach(e => e.line.classList.remove('path'));
  }

  function buildPoc() {
    const start = dom.pocStart.value, goal = dom.pocGoal.value, algo = dom.pocAlgo.value;
    const opts = { h: heuristicFor(goal) };
    state.poc.steps = [...SR[algo](G, start, goal, opts)];
    state.poc.idx = -1;
    state.poc.meta = { start, goal, algo };
  }

  function clearStepClasses() {
    for (const nid in state.nodeEls) state.nodeEls[nid].classList.remove('s-visited', 's-frontier', 's-current', 's-path');
    state.edgeEls.forEach(e => e.line.classList.remove('path'));
  }

  function showStep(i) {
    const step = state.poc.steps[i]; if (!step) return;
    clearStepClasses();
    (step.visited || []).forEach(id => state.nodeEls[id]?.classList.add('s-visited'));
    (step.frontier || []).forEach(id => state.nodeEls[id]?.classList.add('s-frontier'));
    if (step.current) state.nodeEls[step.current]?.classList.add('s-current');
    const algoNames = { bfs: 'BFS', dfs: 'DFS', ids: 'IDS', ucs: 'UCS', greedy: 'Greedy', astar: 'A*' };
    const a = algoNames[state.poc.meta.algo];
    let txt = `${a} · passo ${i + 1}/${state.poc.steps.length}`;
    if (step.current) txt += ` · corrente: <code>${nodeById[step.current].label}</code>`;
    txt += ` · frontiera: ${step.frontier ? step.frontier.length : 0}`;
    if (state.poc.meta.algo === 'astar' && step.g !== undefined)
      txt += ` · g=${step.g} h=${step.h.toFixed(1)} f=${step.f.toFixed(1)}`;
    if (state.poc.meta.algo === 'greedy' && step.h !== undefined) txt += ` · h=${step.h.toFixed(1)}`;
    if (state.poc.meta.algo === 'ucs' && step.g !== undefined) txt += ` · g=${step.g}`;
    if (state.poc.meta.algo === 'ids' && step.limit !== undefined) txt += ` · limite=${step.limit}`;
    if (step.done) {
      if (step.path && step.path.length) {
        step.path.forEach(id => { state.nodeEls[id]?.classList.add('s-path'); });
        highlightPathEdges(step.path);
        const names = step.path.map(id => nodeById[id].label).join(' → ');
        txt = `✓ <b>Trovato</b> con ${a}: ${names} <br><small>cammino di ${step.path.length} nodi (${step.path.length - 1} archi)</small>`;
      } else {
        txt = `✗ Nessun cammino trovato da <code>${nodeById[state.poc.meta.start].label}</code> a <code>${nodeById[state.poc.meta.goal].label}</code>.`;
      }
    }
    dom.pocStatus.innerHTML = txt;
  }

  function highlightPathEdges(path) {
    const set = new Set();
    for (let i = 0; i < path.length - 1; i++) { set.add(path[i] + '|' + path[i + 1]); set.add(path[i + 1] + '|' + path[i]); }
    state.edgeEls.forEach(e => e.line.classList.toggle('path', set.has(e.s + '|' + e.t)));
  }

  function pocStep() {
    if (!state.poc.steps.length) buildPoc();
    if (state.poc.idx >= state.poc.steps.length - 1) return false;
    state.poc.idx++; showStep(state.poc.idx);
    return state.poc.idx < state.poc.steps.length - 1;
  }
  function pocPlay() {
    if (state.poc.timer) { clearInterval(state.poc.timer); state.poc.timer = null; el('poc-play').textContent = '▶ Play'; return; }
    if (state.poc.idx >= state.poc.steps.length - 1 || !state.poc.steps.length) { resetPoc(); buildPoc(); }
    el('poc-play').textContent = '⏸ Pausa';
    const speed = 1260 - Number(dom.pocSpeed.value);
    state.poc.timer = setInterval(() => {
      if (!pocStep()) { clearInterval(state.poc.timer); state.poc.timer = null; el('poc-play').textContent = '▶ Play'; }
    }, speed);
  }

  // ============ THEME ============
  function initTheme() {
    if (localStorage.getItem('theme') === 'dark') {
      document.body.dataset.theme = 'dark';
      el('theme-btn').innerHTML = '<span class="icon">☀️</span> Light';
    }
    el('theme-btn').addEventListener('click', () => {
      const dark = document.body.dataset.theme === 'dark';
      if (dark) { document.body.removeAttribute('data-theme'); el('theme-btn').innerHTML = '<span class="icon">🌙</span> Dark'; localStorage.setItem('theme', 'light'); }
      else { document.body.dataset.theme = 'dark'; el('theme-btn').innerHTML = '<span class="icon">☀️</span> Light'; localStorage.setItem('theme', 'dark'); }
    });
  }

  // ============ utils ============
  function deepCopy(p) { const o = {}; for (const id in p) o[id] = { x: p[id].x, y: p[id].y }; return o; }

  // ============ INIT ============
  function init() {
    initTheme();
    buildGraph();
    buildLegend();
    buildSearchList();
    buildPocSelects();
    const valid = ['force', 'dag', 'mlp', 'tree', 'isa'];
    const initLayout = (location.hash || '').slice(1);
    setLayout(valid.includes(initLayout) ? initLayout : 'force', false);
    bindView();

    document.querySelectorAll('.mz-lay').forEach(b => b.addEventListener('click', () => setLayout(b.dataset.layout, true)));
    el('panel-close').addEventListener('click', closePanel);
    el('poc-toggle').addEventListener('click', () => el('poc').classList.toggle('collapsed'));
    el('poc-play').addEventListener('click', pocPlay);
    el('poc-step').addEventListener('click', () => { if (!state.poc.steps.length) buildPoc(); pocStep(); });
    el('poc-reset').addEventListener('click', () => { resetPoc(); dom.pocStatus.textContent = 'Scegli start, goal e algoritmo, poi Play.'; });
    [dom.pocStart, dom.pocGoal, dom.pocAlgo].forEach(s => s.addEventListener('change', () => { resetPoc(); dom.pocStatus.textContent = 'Pronto. Premi Play o Step.'; }));
    window.addEventListener('resize', () => fitToView());
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
