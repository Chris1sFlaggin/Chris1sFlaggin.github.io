// graph.js — 3d-force-graph initialization, highlight, and camera control

import { nodeColor, nodeSize, TERMINATOR_COLORS, LINK_COLORS } from './colorScheme.js';
import { applyPerformanceProfile } from './performanceManager.js';

let Graph = null;
let _selectedPath  = null;      // Set<id> | null
let _colorFn       = null;      // optional override color function (node) → str|null
let _nodeOverrides = new Map(); // id → color string (transient animation overrides)
let _allNodes      = null;      // reference to data.nodes for nodeColor()

/**
 * Initialize the 3D force graph inside `container`.
 *
 * @param {HTMLElement} container
 * @param {Object}      data          - parsed lcsaj JSON {nodes, links, gadgets}
 * @param {Object}      THREE         - window.THREE
 * @param {Function}    onNodeClick   - callback(node)
 * @param {Function}    onBgClick     - callback()
 * @returns ForceGraph3D instance
 */
export function initGraph(container, data, THREE, onNodeClick, onBgClick) {
  // Destroy previous instance if reloading
  _allNodes = data.nodes;
  if (Graph) {
    try {
      if (Graph._destructor) {
        Graph._destructor();
      }
    } catch (e) {
      console.warn('Graph destructor failed:', e);
    }
    // Clear the container to remove any canvas/WebGL context
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
  }
  _selectedPath = null;

  Graph = ForceGraph3D()(container)
    .graphData({ nodes: data.nodes, links: data.links })
    .nodeId('id')
    .nodeLabel(node =>
      `<div style="background:#111;color:#eee;padding:4px 8px;border-radius:4px;font-size:12px;font-family:monospace">` +
      `<b>${node.id}</b><br>${node.insn_count} insns · ${node.terminator_type}` +
      (node.section !== '.text' ? ` · <span style="color:#ff8c00">${node.section}</span>` : '') +
      `</div>`
    )
    .nodeColor(node => _resolveColor(node, data.nodes))
    .nodeVal(node => nodeSize(node))
    .linkSource('source')
    .linkTarget('target')
    .linkColor(link => LINK_COLORS[link.type] ?? '#555566')
    .linkOpacity(0.55)
    .backgroundColor('#0a0a0f')
    .onNodeClick(onNodeClick)
    .onBackgroundClick(onBgClick)
    .width(container.offsetWidth)
    .height(container.offsetHeight);

  applyPerformanceProfile(
    Graph, THREE,
    data.nodes.length,
    TERMINATOR_COLORS,
    node => _resolveColor(node, _allNodes),
    nodeSize
  );

  // Resize on window resize
  window.addEventListener('resize', () => {
    Graph.width(container.offsetWidth).height(container.offsetHeight);
  });

  return Graph;
}

/**
 * Highlight a gadget path in the graph and fly camera to its centroid.
 * @param {Object|null} gadget - gadget object with .path array, or null to clear
 */
export function highlightGadget(gadget, data) {
  _selectedPath = gadget ? new Set(gadget.path) : null;

  if (!Graph) return;
  Graph.nodeColor(node => _resolveColor(node, _allNodes));

  if (gadget && _selectedPath) {
    const pathNodes = Graph.graphData().nodes.filter(n => _selectedPath.has(n.id));
    if (pathNodes.length === 0) return;

    const cx = pathNodes.reduce((s, n) => s + (n.x ?? 0), 0) / pathNodes.length;
    const cy = pathNodes.reduce((s, n) => s + (n.y ?? 0), 0) / pathNodes.length;
    const cz = pathNodes.reduce((s, n) => s + (n.z ?? 0), 0) / pathNodes.length;

    Graph.cameraPosition(
      { x: cx, y: cy, z: cz + 160 },
      { x: cx, y: cy, z: cz },
      1200
    );
  }
}

/** Clear any active gadget highlight. */
export function clearHighlight() {
  highlightGadget(null);
}

/** Override a single node's color (used by animation engine). */
export function setNodeOverride(id, color) {
  _nodeOverrides.set(id, color);
}

/** Clear all per-node color overrides. */
export function clearAllOverrides() {
  _nodeOverrides.clear();
}

/** Set a global node color function that takes priority over the default. */
export function setNodeColorFn(fn) {
  _colorFn = fn;
}

/** Trigger a graph repaint after override changes. */
export function refreshColors() {
  if (!Graph) return;
  Graph.nodeColor(node => _resolveColor(node, _allNodes));
}

/** Return the raw ForceGraph3D instance (for advanced use). */
export function getGraph() { return Graph; }

// Internal: resolve final color with override > colorFn > selection > default
function _resolveColor(node, allNodes) {
  // 1. Transient animation override (highest priority)
  if (_nodeOverrides.has(node.id)) return _nodeOverrides.get(node.id);
  // 2. Global color function override (comparison layer)
  if (_colorFn) {
    const c = _colorFn(node);
    if (c) return c;
  }
  // 3. Default (selection-aware terminator color)
  return nodeColor(node, _selectedPath, allNodes);
}
