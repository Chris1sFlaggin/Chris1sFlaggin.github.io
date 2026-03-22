// animationEngine.js — Step-through and playback of the lcsajdump animation trace

/**
 * AnimationEngine drives the animation_trace list from a viz JSON.
 *
 * It exposes:
 *   play()          — start auto-playback
 *   pause()         — pause
 *   step()          — advance one tick
 *   stepBack()      — retreat one tick (re-plays from tick 0 up to tick-1)
 *   jumpToPhase(n)  — jump to phase start tick
 *   jumpToTick(t)   — jump to arbitrary tick
 *   reset()         — rewind to start
 *   setSpeed(ms)    — ms per tick in auto-play mode
 *   isPlaying()     — bool
 *   currentTick()   — int
 *   totalTicks()    — int
 *
 * The `applyFn(event, forward)` callback is called for each event to apply it
 * to the graph. When `forward` is false it is called with the previous-state
 * event and the caller should reverse it (used for stepBack).
 */
export class AnimationEngine {
  /**
   * @param {Array}    trace     - animation_trace array from JSON
   * @param {Object}   phaseMap  - {phase_str: first_tick}
   * @param {Function} applyFn  - (event, forward:bool) → void
   */
  constructor(trace, phaseMap, applyFn) {
    this._trace    = trace   ?? [];
    this._phaseMap = phaseMap ?? {};
    this._applyFn  = applyFn;
    this._tick     = 0;
    this._playing  = false;
    this._speed    = 30;   // ms between ticks in play mode
    this._timer    = null;
    this._onUpdate = null; // UI callback(tick, total, phaseLabel)
  }

  // ── Configuration ──────────────────────────────────────────────────────────

  setSpeed(ms) {
    this._speed = Math.max(1, ms);
    if (this._playing) {
      clearInterval(this._timer);
      this._startTimer();
    }
  }

  onUpdate(fn) { this._onUpdate = fn; }

  // ── Playback ───────────────────────────────────────────────────────────────

  play() {
    if (this._playing) return;
    if (this._tick >= this._trace.length) this._applyAll(0, this._trace.length);
    this._playing = true;
    this._startTimer();
    this._notify();
  }

  pause() {
    this._playing = false;
    clearInterval(this._timer);
    this._timer = null;
    this._notify();
  }

  toggle() {
    this._playing ? this.pause() : this.play();
  }

  step() {
    if (this._tick >= this._trace.length) return;
    const ev = this._trace[this._tick];
    this._applyFn && this._applyFn(ev, true);
    this._tick++;
    this._notify();
    if (this._tick >= this._trace.length) this.pause();
  }

  stepBack() {
    if (this._tick <= 0) return;
    this.pause();
    const target = this._tick - 1;
    this._replayTo(target);
  }

  jumpToPhase(phase) {
    const tick = this._phaseMap[String(phase)] ?? this._phaseMap[phase];
    if (tick == null) return;
    this.jumpToTick(tick);
  }

  jumpToTick(target) {
    this.pause();
    if (target < this._tick) {
      this._replayTo(target);
    } else {
      this._applyAll(this._tick, target);
    }
    this._notify();
  }

  reset() {
    this.pause();
    this._tick = 0;
    this._applyFn && this._applyFn({ type: '__reset__' }, false);
    this._notify();
  }

  // ── Accessors ──────────────────────────────────────────────────────────────

  isPlaying()   { return this._playing; }
  currentTick() { return this._tick; }
  totalTicks()  { return this._trace.length; }

  currentPhase() {
    let best = 1;
    for (const [phase, tick] of Object.entries(this._phaseMap)) {
      if (tick <= this._tick) best = Number(phase);
    }
    return best;
  }

  phaseLabel(phase) {
    // Find in trace
    const ev = this._trace.find(e => e.type === 'phase_start' && e.phase === Number(phase));
    return ev?.label ?? `Phase ${phase}`;
  }

  // ── Internal ───────────────────────────────────────────────────────────────

  _startTimer() {
    this._timer = setInterval(() => {
      if (this._tick >= this._trace.length) {
        this.pause();
        return;
      }
      this.step();
    }, this._speed);
  }

  _applyAll(from, to) {
    for (let i = from; i < Math.min(to, this._trace.length); i++) {
      this._applyFn && this._applyFn(this._trace[i], true);
    }
    this._tick = Math.min(to, this._trace.length);
  }

  _replayTo(target) {
    // Reset, then replay events 0..target-1
    this._applyFn && this._applyFn({ type: '__reset__' }, false);
    this._tick = 0;
    this._applyAll(0, target);
  }

  _notify() {
    if (this._onUpdate) {
      this._onUpdate(this._tick, this._trace.length, this.currentPhase());
    }
  }
}


// ─────────────────────────────────────────────────────────────────────────────
// Animation event colors (transient highlights during animation)
// ─────────────────────────────────────────────────────────────────────────────
export const ANIMATION_HIGHLIGHT_COLORS = {
  node_appear:     '#334455',   // faint blue — newly appeared node
  tail_lcsaj:      '#cc44ff',   // magenta — lcsajdump tail
  tail_ropper:     '#ff8844',   // orange — ropper tail
  tail_ropgadget:  '#44ccff',   // cyan — ROPgadget tail
  tail_exclusive:  '#ffff00',   // bright yellow — exclusive tail (the "aha moment")
  bfs_head:        '#ffffff',   // white — current BFS front node
  bfs_path:        '#ff44aa',   // pink — already-walked BFS path
  coverage_lcsaj:  '#cc44ff',
  coverage_shared: '#aaaaaa',
  coverage_none:   '#1a1a2a',
};


// ─────────────────────────────────────────────────────────────────────────────
// AnimationController: bridges engine events → graph overrides
// ─────────────────────────────────────────────────────────────────────────────

/**
 * AnimationController wraps AnimationEngine and translates each event type
 * into calls on the graph module (setNodeOverride / clearAllOverrides).
 *
 * @param {Object} graphModule  - { setNodeOverride, clearAllOverrides, refreshColors }
 * @param {Array}  trace
 * @param {Object} phaseMap
 */
export class AnimationController {
  constructor(graphModule, trace, phaseMap) {
    this._graph   = graphModule;
    this._visible = new Set();     // nodes currently visible
    this._tails   = new Map();     // addr → tool
    this._bfsPath = new Map();     // addr → color

    this._engine = new AnimationEngine(trace, phaseMap, (ev, forward) => {
      this._apply(ev, forward);
      this._graph.refreshColors();
    });
  }

  get engine() { return this._engine; }

  _apply(ev, forward) {
    if (!forward || ev.type === '__reset__') {
      this._reset();
      return;
    }

    const C = ANIMATION_HIGHLIGHT_COLORS;

    switch (ev.type) {
      case 'phase_start':
        // Phase transitions can clear transient state
        if (ev.phase === 3) {
          // Before BFS replay, freeze tail colors
          this._bfsPath.clear();
        }
        if (ev.phase === 4) {
          this._graph.clearAllOverrides();
        }
        break;

      case 'node_appear':
        this._visible.add(ev.id);
        this._graph.setNodeOverride(ev.id, C.node_appear);
        break;

      case 'phase1_bulk':
        // All nodes appear at once — let graph use default colors
        this._graph.clearAllOverrides();
        break;

      case 'edge_appear':
        // Edges are always visible in 3d-force-graph; we just skip this
        break;

      case 'tail_light': {
        const col = C[`tail_${ev.tool}`] ?? '#ffffff';
        this._tails.set(ev.id, col);
        this._graph.setNodeOverride(ev.id, col);
        break;
      }

      case 'tail_exclusive':
        this._graph.setNodeOverride(ev.id, C.tail_exclusive);
        break;

      case 'bfs_step': {
        // Previous BFS front → path color; this node → head color
        // First, soften anything previously marked as head
        for (const [id, col] of this._bfsPath) {
          if (col === C.bfs_head) {
            this._bfsPath.set(id, C.bfs_path);
            this._graph.setNodeOverride(id, C.bfs_path);
          }
        }
        this._bfsPath.set(ev.node_id, C.bfs_head);
        this._graph.setNodeOverride(ev.node_id, C.bfs_head);
        break;
      }

      case 'coverage_final':
        // Signal to app.js to switch to comparison coloring permanently
        // (handled in app.js via engine.onUpdate → enableComparison)
        break;
    }
  }

  _reset() {
    this._visible.clear();
    this._tails.clear();
    this._bfsPath.clear();
    this._graph.clearAllOverrides();
  }
}


// ─────────────────────────────────────────────────────────────────────────────
// UI helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Render the animation control bar into `container`.
 * @param {HTMLElement}          container
 * @param {AnimationController}  controller
 * @param {Function}             onStateChange  - called after any interaction
 */
export function renderAnimationControls(container, controller, onStateChange) {
  if (!container) return;

  container.innerHTML = `
    <div class="anim-controls">
      <button id="anim-reset"  class="anim-btn" title="Reset">⏮</button>
      <button id="anim-back"   class="anim-btn" title="Step back">◀</button>
      <button id="anim-play"   class="anim-btn anim-play" title="Play / Pause">▶</button>
      <button id="anim-step"   class="anim-btn" title="Step forward">▶|</button>
      <div class="anim-phases">
        <button class="phase-btn" data-phase="1">1·Decompose</button>
        <button class="phase-btn" data-phase="2">2·Tails</button>
        <button class="phase-btn" data-phase="3">3·BFS</button>
        <button class="phase-btn" data-phase="4">4·Coverage</button>
      </div>
    </div>
    <div class="anim-progress">
      <input id="anim-scrub" type="range" min="0" max="${controller.engine.totalTicks() - 1}" value="0" step="1">
      <span id="anim-tick-label" class="anim-tick-label">0 / ${controller.engine.totalTicks()}</span>
    </div>
    <div class="anim-speed-row">
      <label class="filter-label">Speed: <span id="anim-speed-val">30ms/tick</span></label>
      <input id="anim-speed" type="range" min="5" max="300" value="30" step="5">
    </div>
    <div id="anim-phase-label" class="anim-phase-label"></div>
  `;

  const eng = controller.engine;

  const playBtn    = container.querySelector('#anim-play');
  const scrub      = container.querySelector('#anim-scrub');
  const tickLabel  = container.querySelector('#anim-tick-label');
  const phaseLabel = container.querySelector('#anim-phase-label');
  const speedInput = container.querySelector('#anim-speed');
  const speedVal   = container.querySelector('#anim-speed-val');

  function syncUI() {
    const t = eng.currentTick();
    const total = eng.totalTicks();
    scrub.value        = t;
    tickLabel.textContent = `${t} / ${total}`;
    playBtn.textContent   = eng.isPlaying() ? '⏸' : '▶';
    phaseLabel.textContent = eng.phaseLabel(eng.currentPhase());
    onStateChange && onStateChange();
  }

  eng.onUpdate(syncUI);

  container.querySelector('#anim-reset').addEventListener('click', () => {
    eng.reset(); syncUI();
  });
  container.querySelector('#anim-back').addEventListener('click', () => {
    eng.stepBack(); syncUI();
  });
  playBtn.addEventListener('click', () => {
    eng.toggle(); syncUI();
  });
  container.querySelector('#anim-step').addEventListener('click', () => {
    eng.step(); syncUI();
  });

  container.querySelectorAll('.phase-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      eng.jumpToPhase(Number(btn.dataset.phase));
      syncUI();
    });
  });

  scrub.addEventListener('input', e => {
    eng.jumpToTick(Number(e.target.value));
    syncUI();
  });

  speedInput.addEventListener('input', e => {
    const ms = Number(e.target.value);
    eng.setSpeed(ms);
    speedVal.textContent = `${ms}ms/tick`;
  });

  syncUI();
}
