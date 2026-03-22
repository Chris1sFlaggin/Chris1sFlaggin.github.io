// colorScheme.js — Visual encoding: terminator type → color, size, opacity

export const TERMINATOR_COLORS = {
  ret:         '#ff4444', // red   — ret, syscall, iret, svc
  call:        '#4488ff', // blue  — call, bl, blr, jal
  jump:        '#ff8c00', // orange — jmp, b, j (unconditional)
  conditional: '#ffdd44', // yellow — je/jne/beq/bne/cbz…
  fallthrough: '#44cc66', // green  — block ends by falling through
};

export const LINK_COLORS = {
  fallthrough: '#3a3a55',
  jump:        '#cc6600',
  call:        '#2255bb',
  conditional: '#aa9900',
  ret:         '#882222',
};

export const TAG_COLORS = {
  LINEAR:      '#44cc66',
  TRAMPOLINE:  '#ff8c00',
  JOP:         '#ff8c00',
  CONDITIONAL: '#ffdd44',
  FALLTHROUGH: '#4488ff',
};

export const LEGEND_ITEMS = [
  { type: 'ret',         label: 'ret / syscall',  color: TERMINATOR_COLORS.ret },
  { type: 'call',        label: 'call',            color: TERMINATOR_COLORS.call },
  { type: 'jump',        label: 'jmp (uncond)',    color: TERMINATOR_COLORS.jump },
  { type: 'conditional', label: 'branch (cond)',   color: TERMINATOR_COLORS.conditional },
  { type: 'fallthrough', label: 'fallthrough',     color: TERMINATOR_COLORS.fallthrough },
];

/**
 * Return the fill color for a node.
 * Nodes in the selected gadget path are white; non-gadget nodes are dimmed.
 * @param {Object} node        - graph node
 * @param {Set|null} pathSet   - set of node ids in the currently selected gadget path
 * @param {Array|null} allNodes - full node list (optional, for opacity calculation)
 */
export function nodeColor(node, pathSet, allNodes) {
  if (pathSet && pathSet.has(node.id)) return '#ffffff';

  const baseColor = TERMINATOR_COLORS[node.terminator_type] ?? '#888888';

  // Dim nodes with no gadgets (optional: only if rendering doesn't support per-node opacity)
  // Most nodes have gadgets, so only dim the truly orphaned ones
  if (allNodes && (!node.gadget_ids || node.gadget_ids.length === 0)) {
    return adjustBrightness(baseColor, 0.4);
  }
  return baseColor;
}

/**
 * Adjust the brightness of a hex color by a factor (0-1).
 */
function adjustBrightness(hex, factor) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const nr = Math.floor(r * factor);
  const ng = Math.floor(g * factor);
  const nb = Math.floor(b * factor);
  return '#' + [nr, ng, nb].map(x => x.toString(16).padStart(2, '0')).join('');
}

/** Node radius scales with instruction count, capped to avoid huge nodes. */
export function nodeSize(node) {
  return Math.max(2, Math.min(node.insn_count * 1.4, 18));
}

/** Dim nodes that are not part of any gadget. */
export function nodeOpacity(node) {
  return (node.gadget_ids && node.gadget_ids.length > 0) ? 1.0 : 0.3;
}
