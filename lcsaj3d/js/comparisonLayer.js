// comparisonLayer.js — Multi-tool comparison layer: toggle state and node coloring

import { TERMINATOR_COLORS } from './colorScheme.js';

export const COMPARISON_COLORS = {
  lcsaj:     '#cc44ff', // magenta  — found only by lcsajdump
  ropper:    '#ff8844', // orange
  ropgadget: '#44ccff', // cyan
  riscyrop:  '#44ff99', // green
  shared:    '#888899', // grey     — covered by 2+ tools
  none:      null,      // use default terminator color
};

export const TOOL_LABELS = {
  lcsaj:     'lcsajdump',
  ropper:    'ropper',
  ropgadget: 'ROPgadget',
  riscyrop:  'RiscyROP',
};

export const TOOL_DESCRIPTIONS = {
  lcsaj:     'lcsajdump: forward LCSAJ graph traversal — seeds from ALL terminators including call rel32 (E8) and REX.B calls',
  ropper:    'ropper: backward scanner — seeds from ret + indirect jmp/call via rax–rdi only; misses REX.B (r8–r15) and E8',
  ropgadget: 'ROPgadget: backward scanner — seeds from ret + indirect jmp/call (all regs incl. r8–r15) + syscall; misses E8',
  riscyrop:  'RiscyROP (RAID 2022): symbolic-execution-based gadget finder and chain builder for RISC-V64 and ARM64; not designed for x86-64 — coverage on x86 benchmarks is simulated',
};

// All comparison tools (excluding lcsajdump itself)
export const OTHER_TOOLS = ['ropper', 'ropgadget', 'riscyrop'];

// Active layer state
const _layers = {
  lcsaj:     true,
  ropper:    true,
  ropgadget: true,
  riscyrop:  true,
};

// null = show all; string = show only gadgets exclusive to this tool
let _exclusiveFilter = null;

export function getExclusiveFilter()       { return _exclusiveFilter; }
export function setExclusiveFilter(tool)   { _exclusiveFilter = tool; }
export function clearExclusiveFilter()     { _exclusiveFilter = null; }

export function getLayerState()            { return { ..._layers }; }
export function setLayerState(tool, val)   { if (tool in _layers) _layers[tool] = !!val; }

/**
 * Return the comparison color for a node, or null to use the default.
 * Priority: animation overrides are handled upstream; this only runs
 * when comparison mode is active.
 */
export function comparisonNodeColor(node) {
  if (!node.tool_coverage) return null;

  const activeTools = Object.entries(_layers)
    .filter(([, on]) => on)
    .map(([t]) => t);

  const covered = activeTools.filter(t => node.tool_coverage[t]);

  if (covered.length === 0) {
    return _darken(TERMINATOR_COLORS[node.terminator_type] ?? '#555566', 0.18);
  }
  if (covered.length === 1) {
    return COMPARISON_COLORS[covered[0]] ?? COMPARISON_COLORS.shared;
  }
  return COMPARISON_COLORS.shared;
}

function _darken(hex, factor) {
  const c = parseInt(hex.replace('#', ''), 16);
  const r = Math.round(((c >> 16) & 0xff) * factor);
  const g = Math.round(((c >> 8)  & 0xff) * factor);
  const b = Math.round(( c        & 0xff) * factor);
  return `#${[r,g,b].map(v => v.toString(16).padStart(2,'0')).join('')}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// UI rendering
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Render comparison layer controls into `container`.
 *
 * @param {HTMLElement} container
 * @param {Object}      data             - parsed lcsaj JSON
 * @param {Function}    onLayerChange    - () called when a checkbox toggles
 * @param {Function}    onExclusiveClick - (tool) called when a tool row is clicked
 */
export function renderLayerControls(container, data, onLayerChange, onExclusiveClick) {
  if (!container) return;

  const meta      = data?.metadata ?? {};
  const simulated = meta.simulated_tools ?? [];
  const versions  = meta.tool_versions  ?? {};
  const stats     = _computeStats(data);

  const toolDefs = [
    { key: 'lcsaj',     color: COMPARISON_COLORS.lcsaj     },
    { key: 'ropper',    color: COMPARISON_COLORS.ropper    },
    { key: 'ropgadget', color: COMPARISON_COLORS.ropgadget },
    { key: 'riscyrop',  color: COMPARISON_COLORS.riscyrop  },
  ];

  container.innerHTML = toolDefs.map(({ key, color }) => {
    const isSim  = simulated.includes(key);
    const label  = TOOL_LABELS[key];
    const desc   = TOOL_DESCRIPTIONS[key];
    const simTag = isSim ? '<span class="sim-badge">sim</span>' : '';

    const nExcl = stats.exclusive[key] ?? 0;

    const titleText = key === 'lcsaj'
      ? `Show ${nExcl} gadget(s) only lcsajdump finds (tail not seeded by any other tool)`
      : `Show ${nExcl} gadget(s) ${label} finds that lcsajdump missed (tail not in lcsajdump's found set)`;

    const exclBtn = `<button class="excl-btn" data-tool="${key}" data-mode="exclusive"
           title="${escHtml(titleText)}"
           >${nExcl} excl</button>`;

    const missedBtn = '';

    return `
      <label class="layer-toggle" data-tool="${key}" title="${escHtml(desc)}">
        <input type="checkbox" data-tool="${key}" ${_layers[key] ? 'checked' : ''}>
        <span class="layer-dot" style="background:${color}"></span>
        <span class="layer-label">${label}${simTag}</span>
        <span class="excl-pair">${exclBtn}${missedBtn}</span>
      </label>`;
  }).join('');

  // shared / total stats
  container.insertAdjacentHTML('beforeend', `
    <span class="layer-shared-stat">shared: ${stats.sharedCount} nodes</span>`);

  // Checkbox change → toggle layer
  container.querySelectorAll('input[type=checkbox]').forEach(cb => {
    cb.addEventListener('change', e => {
      e.stopPropagation();
      setLayerState(e.target.dataset.tool, e.target.checked);
      onLayerChange && onLayerChange();
    });
  });

  // Exclusive/missed button → filter gadget panel
  container.querySelectorAll('.excl-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const tool = btn.dataset.tool;
      const mode = btn.dataset.mode;  // 'exclusive' | 'missed'
      const key  = `${tool}:${mode}`;

      if (_exclusiveFilter === key) {
        // Toggle off
        _exclusiveFilter = null;
        container.querySelectorAll('.excl-btn').forEach(b => b.classList.remove('active'));
      } else {
        _exclusiveFilter = key;
        container.querySelectorAll('.excl-btn').forEach(b =>
          b.classList.toggle('active', b.dataset.tool === tool && b.dataset.mode === mode));
      }
      onExclusiveClick && onExclusiveClick(_exclusiveFilter);
    });
  });
}

// ─────────────────────────────────────────────────────────────────────────────

function _computeStats(data) {
  const exclusive = { lcsaj: 0, ropper: 0, ropgadget: 0, riscyrop: 0 };
  let sharedCount = 0;

  const allTools = ['lcsaj', ...OTHER_TOOLS];

  // exclusive[tool] = count of gadgets with exclusive_to === tool
  for (const g of (data?.gadgets ?? [])) {
    if (g.exclusive_to && g.exclusive_to in exclusive) {
      exclusive[g.exclusive_to]++;
    }
  }

  for (const node of (data?.nodes ?? [])) {
    const tc = node.tool_coverage;
    if (!tc) continue;
    if (allTools.filter(t => tc[t]).length > 1) sharedCount++;
  }

  return { exclusive, sharedCount };
}

function escHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
