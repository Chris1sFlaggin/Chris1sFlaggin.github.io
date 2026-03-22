// infoPanel.js — Right panel: node detail and gadget detail on click

import { TERMINATOR_COLORS, TAG_COLORS } from './colorScheme.js';

let _onGadgetSelect = null;

function esc(str) {
  return String(str)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function _setContent(html) {
  const el = document.getElementById('info-panel-content');
  if (el) el.innerHTML = html;
}

export function clearInfo() {
  _setContent('<p class="info-placeholder">Click a node or gadget to inspect it.</p>');
}

/**
 * Show details for a clicked graph node.
 * @param {Object}   node           - graph node object
 * @param {Object}   data           - full lcsaj JSON dataset
 * @param {Function} onGadgetSelect - callback(gadget)
 */
export function showNodeInfo(node, data, onGadgetSelect) {
  _onGadgetSelect = onGadgetSelect;

  const tColor = TERMINATOR_COLORS[node.terminator_type] ?? '#888';
  const gadgets = (node.gadget_ids ?? [])
    .map(id => data.gadgets.find(g => g.id === id))
    .filter(Boolean);

  const insnRows = node.instructions
    ? node.instructions.map(i =>
        `<div class="insn-row">
           <span class="insn-addr">${esc(i.addr)}</span>
           <span class="insn-mnem">${esc(i.mnemonic)}</span>
           <span class="insn-ops">${esc(i.operands)}</span>
         </div>`
      ).join('')
    : `<p class="dim">${node.insn_count} instructions (stripped for performance)</p>`;

  const gadgetList = gadgets.length
    ? gadgets.map(g => {
        const tc = TAG_COLORS[g.tag] ?? '#888';
        const sig = g.signature.length > 55 ? g.signature.slice(0, 55) + '…' : g.signature;
        return `<div class="info-gadget-link" data-id="${g.id}" title="${esc(g.signature)}">
          <span class="tag-pill" style="background:${tc}22;color:${tc};border:1px solid ${tc}44">${esc(g.tag)}</span>
          <span class="info-gadget-sig">${esc(sig)}</span>
        </div>`;
      }).join('')
    : '<p class="dim">No gadgets pass through this block.</p>';

  _setContent(`
    <div class="info-section">
      <h3 class="info-title">Block <code>${esc(node.id)}</code></h3>
      <div class="info-meta-row">
        <span class="meta-label">Range</span>
        <code>${esc(formatAddr(node.start))} → ${esc(formatAddr(node.end))}</code>
      </div>
      <div class="info-meta-row">
        <span class="meta-label">Section</span>
        <code style="color:${node.section !== '.text' ? '#ff8c00' : '#44cc66'}">${esc(node.section)}</code>
      </div>
      <div class="info-meta-row">
        <span class="meta-label">Instructions</span>
        <span>${node.insn_count}</span>
      </div>
      <div class="info-meta-row">
        <span class="meta-label">Terminator</span>
        <span class="terminator-badge" style="background:${tColor}22;color:${tColor};border:1px solid ${tColor}44">
          ${esc(node.terminator)} (${esc(node.terminator_type)})
        </span>
      </div>
      <div class="info-meta-row">
        <span class="meta-label">In / Out</span>
        <span>${node.in_degree} in, ${node.out_degree} out</span>
      </div>
    </div>

    <div class="info-section">
      <h4 class="info-subtitle">Instructions</h4>
      <div class="insn-block">${insnRows}</div>
    </div>

    <div class="info-section">
      <h4 class="info-subtitle">Gadgets through this block (${gadgets.length})</h4>
      <div id="info-gadget-list">${gadgetList}</div>
    </div>
  `);

  // Wire gadget clicks
  document.getElementById('info-gadget-list')?.addEventListener('click', e => {
    const link = e.target.closest('.info-gadget-link');
    if (!link) return;
    const g = data.gadgets.find(x => x.id === Number(link.dataset.id));
    if (g) _onGadgetSelect?.(g);
  });
}

/**
 * Show full details for a gadget (called from sidebar or from node panel).
 */
export function showGadgetInfo(gadget, data, onGadgetSelect) {
  _onGadgetSelect = onGadgetSelect;

  const tColor   = TAG_COLORS[gadget.tag] ?? '#888';
  const scoreClass = gadget.score > 100 ? 'score-high' : gadget.score > 50 ? 'score-mid' : 'score-low';

  // Reconstruct chain with all instructions per block
  const chainBlocks = gadget.path.map(blockId => {
    const node = data.nodes.find(n => n.id === blockId);
    if (!node) return `<div class="chain-block"><code class="dim">${esc(blockId)} (not found)</code></div>`;
    const rows = node.instructions
      ? node.instructions.map(i =>
          `<div class="insn-row">
             <span class="insn-addr">${esc(i.addr)}</span>
             <span class="insn-mnem">${esc(i.mnemonic)}</span>
             <span class="insn-ops">${esc(i.operands)}</span>
           </div>`
        ).join('')
      : `<p class="dim">${node.insn_count} instructions (stripped for performance)</p>`;
    const tColor2 = TERMINATOR_COLORS[node.terminator_type] ?? '#888';
    return `<div class="chain-block">
      <div class="chain-block-header">
        <code>${esc(blockId)}</code>
        <span style="color:${tColor2};font-size:11px">${esc(node.section)}</span>
      </div>
      <div class="insn-block">${rows}</div>
    </div>`;
  }).join('');

  const dupList = gadget.duplicates.length > 1
    ? gadget.duplicates.map(a => `<code>${esc(a)}</code>`).join(' ')
    : '<span class="dim">unique</span>';

  _setContent(`
    <div class="info-section">
      <h3 class="info-title">Gadget #${gadget.id}</h3>
      <div class="info-meta-row">
        <span class="score-badge ${scoreClass}">${gadget.score}</span>
        <span class="tag-pill" style="background:${tColor}22;color:${tColor};border:1px solid ${tColor}44">${esc(gadget.tag)}</span>
        <span class="cat-label">${esc(gadget.category)}</span>
      </div>
      <div class="info-meta-row">
        <span class="meta-label">Signature</span>
      </div>
      <code class="sig-full">${esc(gadget.signature)}</code>
      <div class="info-meta-row" style="margin-top:8px">
        <span class="meta-label">Instructions</span>
        <span>${gadget.insn_count}</span>
      </div>
      <div class="info-meta-row">
        <span class="meta-label">Found at</span>
        <span>${dupList}</span>
      </div>
    </div>

    <div class="info-section">
      <h4 class="info-subtitle">Chain (${gadget.path.length} block${gadget.path.length > 1 ? 's' : ''})</h4>
      ${chainBlocks}
    </div>
  `);
}

/** Helper: format address (number or string) as hex string. */
function formatAddr(addr) {
  if (typeof addr === 'number') {
    return '0x' + addr.toString(16);
  }
  if (typeof addr === 'string') {
    // Already a hex string, ensure it starts with 0x
    return addr.startsWith('0x') ? addr : '0x' + addr;
  }
  return String(addr);
}

/** Deprecated: use formatAddr instead. */
function hex(n) {
  return typeof n === 'number' ? '0x' + n.toString(16) : String(n);
}
