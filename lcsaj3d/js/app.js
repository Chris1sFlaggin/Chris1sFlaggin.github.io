// app.js — Entry point: file loading, orchestration, panel toggles

import { initGraph, highlightGadget, clearHighlight,
         setNodeColorFn, setNodeOverride, clearAllOverrides, refreshColors } from './graph.js';
import { initGadgetPanel, selectGadget, setExclusiveToolFilter } from './gadgetPanel.js';
import { showNodeInfo, showGadgetInfo, clearInfo }    from './infoPanel.js';
import { renderLayerControls, comparisonNodeColor }   from './comparisonLayer.js';
import { AnimationController, renderAnimationControls } from './animationEngine.js';

let _data           = null;
let _animController = null;

// ─────────────────────────────────────────────────────────────────────────────
// Bootstrap
// ─────────────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  _setupDropZone();
  _setupFileInput();
  _setupPanelToggles();
  const infoPanelContent = document.getElementById('info-panel-content');
  if (infoPanelContent) clearInfo();
});

// ─────────────────────────────────────────────────────────────────────────────
// File loading
// ─────────────────────────────────────────────────────────────────────────────

function _setupFileInput() {
  const input = document.getElementById('file-input');
  if (input) {
    input.addEventListener('change', e => {
      const file = e.target.files[0];
      if (file) _readFile(file);
      input.value = '';
    });
  }
}

function _setupDropZone() {
  const overlay = document.getElementById('drop-overlay');
  document.addEventListener('dragover', e => {
    e.preventDefault();
    overlay && overlay.classList.add('visible');
  });
  document.addEventListener('dragleave', e => {
    if (e.relatedTarget === null) overlay && overlay.classList.remove('visible');
  });
  document.addEventListener('drop', e => {
    e.preventDefault();
    overlay && overlay.classList.remove('visible');
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.json')) _readFile(file);
  });
}

function _readFile(file) {
  _showLoading(file.name);
  const reader = new FileReader();
  reader.onload = e => {
    const text = e.target.result;
    // Parse in a Web Worker to avoid blocking the main thread on large files
    if (typeof Worker !== 'undefined') {
      const blob = new Blob([`self.onmessage=e=>{try{postMessage({ok:true,data:JSON.parse(e.data)})}catch(err){postMessage({ok:false,err:err.message})}}`], { type: 'text/javascript' });
      const worker = new Worker(URL.createObjectURL(blob));
      worker.onmessage = ev => {
        _hideLoading();
        worker.terminate();
        if (!ev.data.ok) { alert(`Failed to parse JSON: ${ev.data.err}`); return; }
        try {
          _validateData(ev.data.data);
          _onDataLoaded(ev.data.data);
        } catch (err) {
          alert(`Failed to load JSON: ${err.message}`);
        }
      };
      worker.postMessage(text);
    } else {
      try {
        const data = JSON.parse(text);
        _validateData(data);
        _onDataLoaded(data);
      } catch (err) {
        alert(`Failed to load JSON: ${err.message}`);
      } finally {
        _hideLoading();
      }
    }
  };
  reader.readAsText(file);
}

function _showLoading(filename) {
  let el = document.getElementById('loading-overlay');
  if (!el) {
    el = document.createElement('div');
    el.id = 'loading-overlay';
    document.body.appendChild(el);
  }
  el.innerHTML = `<div class="loading-box"><div class="loading-spinner"></div><div class="loading-label">Loading ${filename}…</div></div>`;
  el.classList.remove('hidden');
}

function _hideLoading() {
  document.getElementById('loading-overlay')?.classList.add('hidden');
}

function _validateData(data) {
  if (!data.nodes || !data.links || !data.gadgets) {
    throw new Error('Invalid lcsaj JSON: missing nodes, links, or gadgets array.');
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Data loaded
// ─────────────────────────────────────────────────────────────────────────────

function _onDataLoaded(data) {
  _data = data;

  // Stop any running animation
  if (_animController) {
    _animController.engine.pause();
    _animController = null;
  }
  setNodeColorFn(null);
  clearAllOverrides();

  // Top bar stats
  const m = data.metadata ?? {};
  _setText('stat-binary',  m.binary ?? '—');
  _setText('stat-arch',    (m.arch ?? '—').toUpperCase());
  _setText('stat-blocks',  String(data.nodes.length));
  _setText('stat-gadgets', String(data.gadgets.length));
  _setText('stat-edges',   String(data.links.length));

  // Show layout
  document.getElementById('welcome-screen')?.classList.add('hidden');
  document.getElementById('main-layout')?.classList.remove('hidden');

  // Graph
  const container = document.getElementById('graph-container');
  initGraph(container, data, window.THREE, _handleNodeClick, _handleBgClick);

  // Gadget panel
  initGadgetPanel(data, _handleGadgetSelect);

  // Info panel
  clearInfo();

  // ── Feature: multi-tool comparison ──────────────────────────────────────
  const layerBar = document.getElementById('layer-controls-bar');
  if (layerBar) {
    if (m.has_comparison) {
      layerBar.classList.remove('hidden');
      document.documentElement.style.setProperty('--layer-h', '38px');

      // Comparison coloring is ON by default whenever comparison data is present
      setNodeColorFn(comparisonNodeColor);

      const layerContainer = document.getElementById('layer-controls');
      renderLayerControls(
        layerContainer,
        data,
        () => refreshColors(),                    // layer checkbox toggled
        tool => {                                  // exclusive button clicked
          setExclusiveToolFilter(tool);
          // Open left panel so the filtered list is visible
          document.getElementById('left-panel')?.classList.remove('collapsed');
        }
      );
    } else {
      layerBar.classList.add('hidden');
      document.documentElement.style.setProperty('--layer-h', '0px');
    }
  }

  // ── Feature: animation trace ─────────────────────────────────────────────
  const animBar = document.getElementById('animation-bar');
  if (animBar) {
    if (m.has_animation && data.animation_trace) {
      animBar.classList.remove('hidden');
      document.documentElement.style.setProperty('--anim-h', '88px');

      const graphModule = { setNodeOverride, clearAllOverrides, refreshColors };
      _animController = new AnimationController(
        graphModule,
        data.animation_trace,
        data.phase_map ?? {}
      );

      // When animation reaches Phase 4 (coverage_final), restore comparison coloring
      // (animation overrides may have suppressed it during phases 1-3)
      _animController.engine.onUpdate((tick, total, phase) => {
        if (phase === 4 && m.has_comparison) {
          setNodeColorFn(comparisonNodeColor);
        }
      });

      const animContainer = document.getElementById('animation-controls');
      renderAnimationControls(animContainer, _animController, () => {
        // nothing extra needed — engine calls refreshColors internally
      });
    } else {
      animBar.classList.add('hidden');
      document.documentElement.style.setProperty('--anim-h', '0px');
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Interaction handlers
// ─────────────────────────────────────────────────────────────────────────────

function _handleNodeClick(node) {
  if (!_data || !node) return;
  showNodeInfo(node, _data, _handleGadgetSelect);
  _openRightPanel();
}

function _handleGadgetSelect(gadget) {
  if (!gadget || !_data) return;
  highlightGadget(gadget, _data);
  showGadgetInfo(gadget, _data, _handleGadgetSelect);
  selectGadget(gadget);
  _openRightPanel();
}

function _handleBgClick() {
  clearHighlight();
  clearInfo();
  selectGadget(null);
}

// ─────────────────────────────────────────────────────────────────────────────
// Panel toggles
// ─────────────────────────────────────────────────────────────────────────────

function _setupPanelToggles() {
  document.getElementById('toggle-left')?.addEventListener('click', () => {
    document.getElementById('left-panel')?.classList.toggle('collapsed');
  });
  document.getElementById('toggle-right')?.addEventListener('click', () => {
    document.getElementById('right-panel')?.classList.toggle('collapsed');
  });
}

function _openRightPanel() {
  document.getElementById('right-panel')?.classList.remove('collapsed');
}

// ─────────────────────────────────────────────────────────────────────────────
// Utility
// ─────────────────────────────────────────────────────────────────────────────

function _setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}
