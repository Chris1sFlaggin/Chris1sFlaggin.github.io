/* Quiz Sistemi Intelligenti — vanilla JS */
'use strict';

const SOURCE_LABELS = {
  sisint1: 'Appunti SISINT-1 (Altair)',
  con_avv_9cfu: 'Slides "con avversario" 9 CFU',
  risol_FOL: 'Slides "risoluzione FOL"',
  ontologie: 'Slides "ontologie" (9 CFU)',
  aima_ch3: 'Russell & Norvig (AIMA 4ed), cap. 3',
  aima_ch9: 'Russell & Norvig (AIMA 4ed), cap. 9',
  aima_ch10: 'Russell & Norvig (AIMA 4ed), cap. 10',
  aima_ch12: 'Russell & Norvig (AIMA 4ed), cap. 12',
  aima_ch13: 'Russell & Norvig (AIMA 4ed), cap. 13',
  integrato: 'ARGOMENTO INTEGRATO — non presente nel materiale fornito'
};

const state = {
  cfu: null,
  mode: null,
  mcq: [],
  matching: [],
  pool: [],         // pool of questions for current cfu
  quiz: [],         // current quiz subset (with order)
  idx: 0,
  answers: {},      // qid → answer (string for mcq, object {item_id: label} for matching)
  lastConfig: null  // for retry
};

// ===== theme =====
function toggleTheme() {
  const isDark = document.body.dataset.theme === 'dark';
  if (isDark) {
    document.body.removeAttribute('data-theme');
    document.getElementById('theme-btn').innerHTML = '<span class="icon">🌙</span> Dark';
    localStorage.setItem('theme', 'light');
  } else {
    document.body.dataset.theme = 'dark';
    document.getElementById('theme-btn').innerHTML = '<span class="icon">☀️</span> Light';
    localStorage.setItem('theme', 'dark');
  }
}

// ===== bootstrap =====
window.addEventListener('DOMContentLoaded', async () => {
  if (localStorage.getItem('theme') === 'dark') {
    document.body.dataset.theme = 'dark';
    const btn = document.getElementById('theme-btn');
    if (btn) btn.innerHTML = '<span class="icon">☀️</span> Light';
  }
  try {
    await loadData();
  } catch (e) {
    document.getElementById('app').innerHTML =
      '<p style="color:#c00">Errore nel caricamento dei dati: ' + e.message + '</p>';
    return;
  }
  bindEvents();
});

async function loadData() {
  const [mcqText, matchText] = await Promise.all([
    fetch('mcq.csv').then(r => r.text()),
    fetch('matching.csv').then(r => r.text())
  ]);
  const mcq = Papa.parse(mcqText, { header: true, skipEmptyLines: true }).data;
  const match = Papa.parse(matchText, { header: true, skipEmptyLines: true }).data;
  state.mcq = mcq.map(r => ({
    type: 'mcq',
    id: 'mcq-' + r.id,
    raw_id: r.id,
    cfu: r.cfu,
    parte: r.parte,
    topic: r.topic,
    question: r.question,
    opts: [r.opt_a, r.opt_b, r.opt_c],
    correct: r.correct,
    source: r.source,
    explanation: r.explanation || ''
  }));
  // group matching rows by group_id
  const groups = {};
  for (const row of match) {
    const gid = row.group_id;
    if (!groups[gid]) {
      groups[gid] = {
        type: 'matching',
        id: 'mt-' + gid,
        raw_id: gid,
        cfu: row.cfu,
        parte: row.parte,
        topic: row.topic,
        group_text: row.group_text,
        labels: parseLabels(row.labels),
        items: [],
        source: row.source
      };
    }
    groups[gid].items.push({
      id: row.item_id,
      text: row.item_text,
      correct: row.correct,
      explanation: row.explanation || ''
    });
  }
  state.matching = Object.values(groups);
  console.log('Loaded', state.mcq.length, 'MCQ +', state.matching.length, 'matching groups');
}

function parseLabels(s) {
  return s.split('|').map(p => {
    const [key, ...rest] = p.split('=');
    return { key: key.trim(), text: rest.join('=').trim() };
  });
}

// ===== events =====
function bindEvents() {
  document.querySelectorAll('.cfu-btn').forEach(b => {
    b.addEventListener('click', () => selectCfu(b.dataset.cfu));
  });
  document.querySelectorAll('.mode-btn').forEach(b => {
    b.addEventListener('click', () => selectMode(b.dataset.mode));
  });
  document.querySelectorAll('.back-btn').forEach(b => {
    b.addEventListener('click', () => showScreen(b.dataset.target));
  });
  document.getElementById('topic-start-btn').addEventListener('click', startTopicQuiz);
  document.getElementById('prev-btn').addEventListener('click', () => navigate(-1));
  document.getElementById('next-btn').addEventListener('click', () => navigate(1));
  document.getElementById('submit-btn').addEventListener('click', submitQuiz);
  document.getElementById('retry-btn').addEventListener('click', retryQuiz);
  document.getElementById('new-quiz-btn').addEventListener('click', () => showScreen('mode-screen'));
  document.getElementById('home-btn').addEventListener('click', () => showScreen('start-screen'));
  document.getElementById('rev-parte').addEventListener('change', renderReview);
  document.getElementById('rev-type').addEventListener('change', renderReview);
  document.getElementById('rev-search').addEventListener('input', renderReview);
  document.getElementById('filter-parte').addEventListener('change', updateTopicOptions);

  document.getElementById('theme-btn').addEventListener('click', toggleTheme);

  // Global event delegation for explanation buttons
  document.addEventListener('click', (e) => {
    if (e.target.closest('.explain-btn')) {
      const btn = e.target.closest('.explain-btn');
      const targetId = btn.dataset.target;
      if (targetId) {
        const el = document.getElementById(targetId);
        if (el) {
          el.hidden = !el.hidden;
        }
      }
    }
  });
}

// ===== navigation =====
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0, 0);
}

function selectCfu(cfu) {
  state.cfu = cfu;
  state.pool = [...state.mcq, ...state.matching].filter(q => q.cfu === 'both' || q.cfu === cfu);
  document.getElementById('cfu-display').textContent = cfu + ' CFU';
  document.getElementById('cfu-display-header').textContent = cfu + ' CFU Selezionati';
  showScreen('mode-screen');
}

function selectMode(mode) {
  state.mode = mode;
  if (mode === 'topic') {
    updateTopicOptions();
    showScreen('topic-screen');
  } else if (mode === 'review') {
    renderReview();
    showScreen('review-screen');
  } else {
    startQuiz(mode);
  }
}

// ===== quiz setup =====
function startQuiz(mode, opts = {}) {
  let qs = [];
  let scoring = { mcq: 1, matchItem: 1, maxPoints: null, examMode: false };
  if (mode === 'esame') {
    // ESEMPIO format: 5 MCQ (3pt each) + 2 matching/VF groups (4 items × 1pt each) = 23pt
    const mcqs = shuffle(state.pool.filter(q => q.type === 'mcq')).slice(0, 5);
    const mtCandidates = state.pool.filter(q => q.type === 'matching' && q.items.length >= 4);
    const mts = shuffle(mtCandidates).slice(0, 2).map(g => ({
      ...g,
      items: shuffle(g.items).slice(0, 4)
    }));
    qs = mcqs.concat(mts);
    scoring = { mcq: 3, matchItem: 1, maxPoints: 5*3 + 2*4*1, examMode: true };
  } else if (mode === 'mcq_full') {
    qs = shuffle(state.pool.filter(q => q.type === 'mcq'));
  } else if (mode === 'matching_full') {
    qs = shuffle(state.pool.filter(q => q.type === 'matching'));
  } else if (mode === 'topic') {
    let arr = state.pool;
    if (opts.parte !== 'all') arr = arr.filter(q => q.parte === opts.parte);
    if (opts.topic !== 'all') arr = arr.filter(q => q.topic === opts.topic);
    if (opts.type === 'mcq') arr = arr.filter(q => q.type === 'mcq');
    if (opts.type === 'matching') arr = arr.filter(q => q.type === 'matching');
    qs = shuffle(arr).slice(0, opts.count);
  }
  if (qs.length === 0) {
    alert('Nessuna domanda corrisponde a questo filtro.');
    return;
  }
  state.quiz = qs;
  state.idx = 0;
  state.answers = {};
  state.scoring = scoring;
  state.lastConfig = { mode, opts };
  document.getElementById('q-total').textContent = qs.length;
  document.getElementById('q-progress').max = qs.length;
  renderQuestion();
  showScreen('quiz-screen');
}

function startTopicQuiz() {
  const parte = document.getElementById('filter-parte').value;
  const topic = document.getElementById('filter-topic').value;
  const type = document.getElementById('filter-type').value;
  const count = parseInt(document.getElementById('filter-count').value, 10) || 10;
  startQuiz('topic', { parte, topic, type, count });
}

function updateTopicOptions() {
  const parte = document.getElementById('filter-parte').value;
  let arr = state.pool;
  if (parte !== 'all') arr = arr.filter(q => q.parte === parte);
  const topics = [...new Set(arr.map(q => q.topic))].sort();
  const sel = document.getElementById('filter-topic');
  sel.innerHTML = '<option value="all">Tutti</option>' +
    topics.map(t => `<option value="${escAttr(t)}">${escHtml(t)}</option>`).join('');
}

// ===== render question =====
function renderQuestion() {
  const q = state.quiz[state.idx];
  document.getElementById('q-num').textContent = state.idx + 1;
  document.getElementById('q-progress').value = state.idx + 1;
  const body = document.getElementById('quiz-body');
  body.innerHTML = renderCard(q, state.answers[q.id], false);
  attachCardHandlers(body, q);
  document.getElementById('prev-btn').disabled = state.idx === 0;
  const isLast = state.idx === state.quiz.length - 1;
  document.getElementById('next-btn').style.display = isLast ? 'none' : '';
  document.getElementById('submit-btn').style.display = isLast ? '' : 'none';
}

function renderCard(q, userAnswer, showCorrect) {
  const tags = renderTags(q);
  const cite = renderSourceCite(q.source);
  if (q.type === 'mcq') {
    const explBtn = q.explanation ? `<div class="explain-zone">
        <button class="explain-btn" data-target="expl-${q.id}">💡 Non lo so — spiegami</button>
        <div class="explanation" id="expl-${q.id}" hidden>
          <strong>Risposta corretta: ${q.correct.toUpperCase()}.</strong> ${escHtml(q.explanation)}
        </div>
      </div>` : '';
    return `<div class="question-card" data-qid="${q.id}">
      <div class="q-header">
        <div class="q-tags">${tags}</div>
      </div>
      <p class="q-text">${escHtml(q.question)}</p>
      <ul class="options">
        ${q.opts.map((opt, i) => {
          const letter = ['a','b','c'][i];
          let cls = '';
          if (userAnswer === letter) cls = ' selected';
          if (showCorrect) {
            if (letter === q.correct) cls = ' correct';
            else if (userAnswer === letter) cls = ' wrong';
          }
          return `<li class="opt-row${cls}" data-letter="${letter}">
            <span class="opt-label">${letter.toUpperCase()})</span>
            <span>${escHtml(opt)}</span>
          </li>`;
        }).join('')}
      </ul>
      ${explBtn}
      ${cite}
    </div>`;
  }
  // matching
  const legend = '<div class="labels-legend"><strong>Etichette:</strong>' +
    q.labels.map(l => `<span class="label-item"><span class="label-key">${escHtml(l.key)}</span> ${escHtml(l.text)}</span>`).join('') +
    '</div>';
  const items = q.items.map(it => {
    const ans = userAnswer && userAnswer[it.id];
    let cls = '';
    if (showCorrect) {
      cls = (ans === it.correct) ? ' correct' : ' wrong';
    }
    const explBtn = it.explanation ? `<button class="explain-btn small" data-target="expl-${q.id}-${it.id}">💡</button>` : '';
    const explPanel = it.explanation ? `<div class="explanation item-expl" id="expl-${q.id}-${it.id}" hidden>
        <strong>[${escHtml(it.correct)}]</strong> ${escHtml(it.explanation)}
      </div>` : '';
    return `<div class="matching-row" data-itemid="${it.id}">
      <div class="matching-item${cls}">
        <span class="item-text">${escHtml(it.text)}</span>
        <select data-item="${it.id}">
          <option value="">—</option>
          ${q.labels.map(l => `<option value="${escAttr(l.key)}"${ans===l.key?' selected':''}>${escHtml(l.key)}</option>`).join('')}
        </select>
        ${showCorrect ? `<span class="correct-label" style="font-size:0.85rem;color:#1b6b5e">→ ${escHtml(it.correct)}</span>` : ''}
        ${explBtn}
      </div>
      ${explPanel}
    </div>`;
  }).join('');
  return `<div class="question-card" data-qid="${q.id}">
    <div class="q-header">
      <div class="q-tags">${tags}</div>
    </div>
    <p class="q-text">${escHtml(q.group_text)}</p>
    ${legend}
    <div class="matching-items">${items}</div>
    ${cite}
  </div>`;
}

function renderTags(q) {
  let html = `<span class="badge badge-parte">Parte ${q.parte}</span>`;
  html += `<span class="badge badge-topic">${escHtml(q.topic)}</span>`;
  if (q.cfu === '9') html += `<span class="badge badge-cfu">solo 9 CFU</span>`;
  if (q.source === 'integrato') html += `<span class="badge badge-integrato">argomento integrato</span>`;
  return html;
}

function renderSourceCite(source) {
  const label = SOURCE_LABELS[source] || source;
  const cls = source === 'integrato' ? ' style="color:#cc5a00;font-weight:600"' : '';
  return `<p class="source-cite"${cls}>Fonte: ${escHtml(label)}</p>`;
}

function attachCardHandlers(container, q) {
  if (q.type === 'mcq') {
    container.querySelectorAll('.opt-row').forEach(li => {
      li.addEventListener('click', () => {
        state.answers[q.id] = li.dataset.letter;
        container.querySelectorAll('.opt-row').forEach(o => o.classList.remove('selected'));
        li.classList.add('selected');
      });
    });
  } else {
    container.querySelectorAll('select[data-item]').forEach(sel => {
      sel.addEventListener('change', () => {
        if (!state.answers[q.id]) state.answers[q.id] = {};
        state.answers[q.id][sel.dataset.item] = sel.value;
      });
    });
  }
}

function navigate(dir) {
  state.idx = Math.max(0, Math.min(state.quiz.length - 1, state.idx + dir));
  renderQuestion();
}

// ===== submit & results =====
function submitQuiz() {
  const sc = state.scoring || { mcq: 1, matchItem: 1, maxPoints: null, examMode: false };
  let earnedPoints = 0;
  let maxPoints = 0;
  let correctCount = 0;
  let totalCount = 0;
  const detail = [];
  for (const q of state.quiz) {
    const ans = state.answers[q.id];
    if (q.type === 'mcq') {
      totalCount += 1;
      maxPoints += sc.mcq;
      const ok = ans === q.correct;
      const pts = ok ? sc.mcq : 0;
      if (ok) { correctCount += 1; earnedPoints += pts; }
      detail.push({ q, ok, ans, pts, maxPts: sc.mcq });
    } else {
      let itemsCorrect = 0;
      let itemPts = 0;
      for (const it of q.items) {
        totalCount += 1;
        maxPoints += sc.matchItem;
        const a = ans && ans[it.id];
        if (a === it.correct) { correctCount += 1; itemsCorrect += 1; earnedPoints += sc.matchItem; itemPts += sc.matchItem; }
      }
      detail.push({ q, ok: itemsCorrect === q.items.length, ans, itemsCorrect, itemsTotal: q.items.length, pts: itemPts, maxPts: q.items.length * sc.matchItem });
    }
  }
  const summary = document.getElementById('score-correct').parentElement;
  if (sc.examMode) {
    summary.innerHTML = `<span id="score-correct">${earnedPoints}</span> / <span id="score-total">${sc.maxPoints || maxPoints}</span> <span style="font-size:1.5rem">punti</span>`;
  } else {
    document.getElementById('score-correct').textContent = correctCount;
    document.getElementById('score-total').textContent = totalCount;
  }
  const pct = maxPoints ? Math.round(100 * earnedPoints / maxPoints) : 0;
  const pctEl = document.getElementById('score-pct');
  pctEl.textContent = pct;
  pctEl.className = 'score-pct ' + (pct >= 65 ? 'good' : (pct < 50 ? 'bad' : ''));
  // exam mode: show breakdown
  const headerInfo = sc.examMode
    ? `<p style="text-align:center;color:#6c757d;margin:-0.5rem 0 1rem"><strong>Parte 1</strong>: ${detail.filter(d=>d.q.type==='mcq').reduce((a,d)=>a+d.pts,0)} / 15 pt · <strong>Parte 2</strong>: ${detail.filter(d=>d.q.type==='matching').reduce((a,d)=>a+d.pts,0)} / 8 pt</p>`
    : '';
  const det = document.getElementById('results-detail');
  det.innerHTML = headerInfo + detail.map(d => {
    const card = renderCard(d.q, d.ans, true);
    let fb;
    if (d.q.type === 'mcq') {
      const ansLetter = d.ans ? d.ans.toUpperCase() : 'nessuna';
      fb = d.ok
        ? `<div class="feedback ok">✓ Corretta (${ansLetter}) — <strong>${d.pts}/${d.maxPts} pt</strong></div>`
        : `<div class="feedback ko">✗ La tua: ${ansLetter}. Corretta: ${d.q.correct.toUpperCase()} — <strong>0/${d.maxPts} pt</strong></div>`;
    } else {
      fb = `<div class="feedback ${d.ok?'ok':'ko'}">${d.itemsCorrect}/${d.itemsTotal} item corretti — <strong>${d.pts}/${d.maxPts} pt</strong></div>`;
    }
    return `<div class="result-item">${card}${fb}</div>`;
  }).join('');
  det.querySelectorAll('.opt-row').forEach(o => o.style.pointerEvents = 'none');
  det.querySelectorAll('select').forEach(s => s.disabled = true);
  showScreen('results-screen');
}

function retryQuiz() {
  if (!state.lastConfig) return;
  startQuiz(state.lastConfig.mode, state.lastConfig.opts);
}

// ===== review =====
function renderReview() {
  const parte = document.getElementById('rev-parte').value;
  const type = document.getElementById('rev-type').value;
  const search = document.getElementById('rev-search').value.toLowerCase();
  let arr = state.pool;
  if (parte !== 'all') arr = arr.filter(q => q.parte === parte);
  if (type === 'mcq') arr = arr.filter(q => q.type === 'mcq');
  if (type === 'matching') arr = arr.filter(q => q.type === 'matching');
  if (search) {
    arr = arr.filter(q => {
      const txt = (q.type === 'mcq' ? q.question + ' ' + q.opts.join(' ') : q.group_text + ' ' + q.items.map(i=>i.text).join(' ')) + ' ' + q.topic;
      return txt.toLowerCase().includes(search);
    });
  }
  const list = document.getElementById('review-list');
  list.innerHTML = arr.map(q => {
    if (q.type === 'mcq') {
      const expl = q.explanation ? `<div class="explanation review-expl"><strong>Spiegazione:</strong> ${escHtml(q.explanation)}</div>` : '';
      return `<div class="review-card">
        <div class="q-tags">${renderTags(q)}</div>
        <p class="q-text">${escHtml(q.question)}</p>
        ${q.opts.map((o,i)=>{
          const letter=['a','b','c'][i];
          const cls = letter===q.correct ? 'correct' : 'other';
          return `<div class="answer-line ${cls}"><strong>${letter.toUpperCase()})</strong> ${escHtml(o)}</div>`;
        }).join('')}
        ${expl}
        ${renderSourceCite(q.source)}
      </div>`;
    }
    const matchingItems = q.items.map(it => {
      const itemExpl = it.explanation ? `<div class="explanation review-expl item-expl-review">${escHtml(it.explanation)}</div>` : '';
      return `<div class="answer-line correct" style="flex-direction:column; align-items:flex-start;">
        <div><strong>[${escHtml(it.correct)}]</strong> ${escHtml(it.text)}</div>
        ${itemExpl}
      </div>`;
    }).join('');
    return `<div class="review-card">
      <div class="q-tags">${renderTags(q)}</div>
      <p class="q-text">${escHtml(q.group_text)}</p>
      <div class="labels-legend"><strong>Etichette:</strong>${q.labels.map(l=>`<span class="label-item"><span class="label-key">${escHtml(l.key)}</span> ${escHtml(l.text)}</span>`).join('')}</div>
      ${matchingItems}
      ${renderSourceCite(q.source)}
    </div>`;
  }).join('') || '<p style="color:#888">Nessun risultato.</p>';
}

// ===== utils =====
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function escHtml(s) {
  if (s == null) return '';
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
}
function escAttr(s) { return escHtml(s); }
