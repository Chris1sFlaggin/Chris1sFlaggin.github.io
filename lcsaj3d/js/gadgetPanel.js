// gadgetPanel.js — Left sidebar: filterable gadget list

import { TAG_COLORS } from './colorScheme.js';
import { COMPARISON_COLORS, TOOL_LABELS } from './comparisonLayer.js';

let _data      = null;
let _nodeById  = null;   // Map<id, node> — built on init for fast tail lookups
let _onSelect  = null;
let _activeId  = null;

// Filter state
let _filterCat      = 'All';
let _filterTag      = 'All';
let _filterSection  = 'All';
let _minScore       = 0;
let _searchText     = '';
let _exclusiveTool  = null;   // null = all; 'tool:exclusive' = filter by exclusive_to
let _pageSize       = 100;
let _visibleCount   = 100;

/**
 * Initialize the gadget panel.
 * @param {Object}   data       - parsed lcsaj JSON
 * @param {Function} onSelect   - callback(gadget)
 */
export function initGadgetPanel(data, onSelect) {
  _data          = data;
  _nodeById      = new Map((data?.nodes ?? []).map(n => [n.id, n]));
  _onSelect      = onSelect;
  _activeId      = null;
  _exclusiveTool = null;
  _filterSection = 'All';
  _visibleCount  = _pageSize;
  _render();
}

/** Programmatically select a gadget (e.g. called from infoPanel). */
export function selectGadget(gadget) {
  _activeId = gadget ? gadget.id : null;
  _renderList();
}

/**
 * Filter the gadget list to show only gadgets exclusive to `tool`.
 * Pass null to clear the filter and show all gadgets.
 * For 'lcsaj': shows gadgets with exclusive_to === 'lcsaj'.
 * For other tools: shows gadgets whose path passes through a node
 *   covered exclusively by that tool (best approximation, since
 *   we only have lcsajdump gadgets in the list).
 */
export function setExclusiveToolFilter(tool) {
  _exclusiveTool = tool;
  _renderList();
  // Update the panel header badge
  const badge = document.getElementById('gp-exclusive-badge');
  if (badge) {
    if (tool) {
      const [filterTool] = tool.split(':');
      const label = TOOL_LABELS[filterTool] ?? filterTool;
      const color = COMPARISON_COLORS[filterTool] ?? '#888';
      badge.innerHTML = `<span style="color:${color}">● ${label}-exclusive</span>
        <button id="gp-clear-excl" title="Clear filter">✕</button>`;
      badge.classList.remove('hidden');
      badge.querySelector('#gp-clear-excl')?.addEventListener('click', () => {
        setExclusiveToolFilter(null);
      });
    } else {
      badge.innerHTML = '';
      badge.classList.add('hidden');
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────

function _filtered() {
  if (!_data) return [];
  return _data.gadgets.filter(g => {
    if (_filterCat !== 'All' && g.category !== _filterCat)   return false;
    if (_filterTag !== 'All' && g.tag !== _filterTag)         return false;
    if (g.score < _minScore)                                   return false;
    if (_searchText && !g.signature.toLowerCase().includes(_searchText)) return false;

    // Section filter — check the tail node's section
    if (_filterSection !== 'All') {
      const tailId   = g.path?.[g.path.length - 1];
      const tailNode = tailId ? _nodeById?.get(tailId) : null;
      if ((tailNode?.section ?? '.text') !== _filterSection) return false;
    }

    // Exclusive filter (format: "tool:exclusive")
    if (_exclusiveTool !== null) {
      const [tool] = _exclusiveTool.split(':');
      if ((g.exclusive_to ?? null) !== tool) return false;
    }

    return true;
  });
}

function _render() {
  const container = document.getElementById('gadget-list-container');
  if (!container) return;

  const maxScore   = _data ? Math.max(..._data.gadgets.map(g => g.score), 200) : 200;
  const allTags    = _data ? [...new Set(_data.gadgets.map(g => g.tag))].sort() : [];
  const allSections = _data
    ? [...new Set(_data.nodes.map(n => n.section).filter(Boolean))].sort()
    : [];

  container.innerHTML = `
    <div class="panel-filters">
      <input id="gp-search" class="filter-input" type="text" placeholder="Search signature…" value="${_searchText}">
      <div class="filter-row">
        <select id="gp-cat" class="filter-select">
          <option value="All">All categories</option>
          <option value="Sequential">Sequential</option>
          <option value="Jump-Based">Jump-Based</option>
        </select>
        <select id="gp-tag" class="filter-select">
          <option value="All">All tags</option>
          ${allTags.map(t => `<option value="${t}">${escHtml(t)}</option>`).join('')}
        </select>
      </div>
      <div class="filter-row">
        <select id="gp-section" class="filter-select" style="width:100%">
          <option value="All">All sections</option>
          ${allSections.map(s => `<option value="${escHtml(s)}">${escHtml(s)}</option>`).join('')}
        </select>
      </div>
      <div class="filter-row score-row">
        <label for="gp-score" class="filter-label">Min score: <span id="gp-score-val">${_minScore}</span></label>
        <input id="gp-score" type="range" min="0" max="${maxScore}" value="${_minScore}" step="5">
      </div>
      <div id="gp-exclusive-badge" class="exclusive-badge hidden"></div>
      <div id="gp-stats" class="panel-stats"></div>
    </div>
    <div id="gadget-list" class="gadget-list"></div>
  `;

  container.querySelector('#gp-cat').value     = _filterCat;
  container.querySelector('#gp-tag').value     = _filterTag;
  container.querySelector('#gp-section').value = _filterSection;

  container.querySelector('#gp-search').addEventListener('input', e => {
    _searchText = e.target.value.trim().toLowerCase();
    _visibleCount = _pageSize;
    _renderList();
  });
  container.querySelector('#gp-cat').addEventListener('change', e => {
    _filterCat = e.target.value;
    _visibleCount = _pageSize;
    _renderList();
  });
  container.querySelector('#gp-tag').addEventListener('change', e => {
    _filterTag = e.target.value;
    _visibleCount = _pageSize;
    _renderList();
  });
  container.querySelector('#gp-section').addEventListener('change', e => {
    _filterSection = e.target.value;
    _visibleCount = _pageSize;
    _renderList();
  });
  container.querySelector('#gp-score').addEventListener('input', e => {
    _minScore = Number(e.target.value);
    container.querySelector('#gp-score-val').textContent = _minScore;
    _visibleCount = _pageSize;
    _renderList();
  });

  // Re-apply exclusive filter badge if one was active
  if (_exclusiveTool) setExclusiveToolFilter(_exclusiveTool);

  _renderList();
}

function _renderList() {
  const list  = document.getElementById('gadget-list');
  const stats = document.getElementById('gp-stats');
  if (!list) return;

  const items = _filtered();
  const meta  = _data?.metadata ?? {};
  const totalInBinary = meta.gadgets_capped
    ? `${meta.total_gadgets} total (showing top ${meta.gadgets_exported ?? items.length} by score)`
    : String(_data?.gadgets.length ?? 0);
  stats && (stats.textContent = `Showing ${Math.min(items.length, _visibleCount)} / ${items.length} filtered · ${totalInBinary} in binary`);

  const visible = items.slice(0, _visibleCount);

  list.innerHTML = visible.map(g => {
    const tagColor   = TAG_COLORS[g.tag] ?? '#888';
    const scoreClass = g.score > 100 ? 'score-high' : g.score > 50 ? 'score-mid' : 'score-low';
    const sig        = g.signature.length > 52 ? g.signature.slice(0, 52) + '…' : g.signature;
    const dupBadge   = g.duplicates.length > 1
      ? `<span class="dup-badge">×${g.duplicates.length}</span>` : '';
    const active     = g.id === _activeId ? ' active' : '';

    // Exclusive badge — highlight gadgets only lcsajdump can find
    const exclBadge  = g.exclusive_to === 'lcsaj'
      ? `<span class="excl-lcsaj-badge" title="Only lcsajdump finds this gadget">★ lcsaj-only</span>` : '';

    return `
      <div class="gadget-item${active}" data-id="${g.id}" title="${escHtml(g.signature)}">
        <div class="gadget-item-top">
          <span class="score-badge ${scoreClass}">${g.score}</span>
          <span class="tag-pill" style="background:${tagColor}22;color:${tagColor};border:1px solid ${tagColor}44">${g.tag}</span>
          <span class="cat-label">${g.category}</span>
          ${exclBadge}
          ${dupBadge}
        </div>
        <div class="gadget-sig">${escHtml(sig)}</div>
      </div>`;
  }).join('');

  // "Load more" button if there are more items
  if (items.length > _visibleCount) {
    list.insertAdjacentHTML('beforeend',
      `<button id="gp-load-more" class="load-more-btn">
         Load more (${items.length - _visibleCount} remaining)
       </button>`);
    list.querySelector('#gp-load-more')?.addEventListener('click', () => {
      _visibleCount += _pageSize;
      _renderList();
    });
  }

  list.onclick = e => {
    const item = e.target.closest('.gadget-item');
    if (!item) return;
    const gid = Number(item.dataset.id);
    const gadget = _data.gadgets.find(g => g.id === gid);
    if (!gadget) return;
    _activeId = gid;
    _renderList();
    _onSelect && _onSelect(gadget);
  };
}

function escHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
