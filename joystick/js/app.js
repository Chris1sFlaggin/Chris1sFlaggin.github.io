(() => {
"use strict";


/* ── configurazione (config.js) ──────────────────────── */
const FALLBACK_CONFIG = {
  lever: {
    topic: "", label: "velocità", unit: "%", min: 0, max: 100, start: 100, step: 5,
    spring: false, scalesStick: true,
    keys: { up: ["KeyR"], down: ["KeyF"], zero: ["KeyZ"] },
    gamepadAxis: 3, gamepadUp: 7, gamepadDown: 6, gamepadRate: 80,
    reverse: { start: 1, keys: ["KeyX"], gamepadButton: 1, forwardLabel: "avanti", reverseLabel: "retro" }
  },
  axis: {
    up: ["KeyW", "ArrowUp"], down: ["KeyS", "ArrowDown"],
    left: ["KeyA", "ArrowLeft"], right: ["KeyD", "ArrowRight"],
    gamepadAxes: [0, 1], gamepadDpad: { up: 12, down: 13, left: 14, right: 15 }, keyRamp: 0.28
  },
  stopKeys: ["Space"],
  defaults: {}
};
const CFG = Object.assign({}, FALLBACK_CONFIG, window.JOYSTICK_CONFIG || {});
CFG.axis = Object.assign({}, FALLBACK_CONFIG.axis, CFG.axis || {});
CFG.lever = Object.assign({}, FALLBACK_CONFIG.lever, CFG.lever || {});
CFG.lever.keys = Object.assign({}, FALLBACK_CONFIG.lever.keys, CFG.lever.keys || {});
CFG.lever.reverse = Object.assign({}, FALLBACK_CONFIG.lever.reverse, CFG.lever.reverse || {});
const LV = CFG.lever;
if (!(LV.max > LV.min)) { LV.min = 0; LV.max = 100; }
CFG.stopKeys = CFG.stopKeys && CFG.stopKeys.length ? CFG.stopKeys : FALLBACK_CONFIG.stopKeys;
const DEF = CFG.defaults || {};

/* ── helpers ─────────────────────────────────────────── */
const $ = (s, r = document) => r.querySelector(s);
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const r3 = v => Math.round(v * 1000) / 1000;
const fx = (v, n = 3) => v.toFixed(n);

/* ── form refs (chiavi = id) ─────────────────────────── */
const F = {};
for (const id of ["host","port","path","tls","user","pass","cid","proto","keepalive","reconnect","clean",
                  "tMove","tSpeed","qos","sub","retain",
                  "fmt","addType","tplMove","tplSpeed","rawMove","rawSpeed",
                  "rate","dz","hb","onchange","invY","remember","pubTopic","pubRetain"]) {
  const el = $("#" + id);
  if (el) F[id] = el;                 // un campo assente non deve poter bloccare l'avvio
  else console.warn("joystick: campo #" + id + " assente nell'HTML");
}

const STORE = "joystick.mqtt.v2";
function saveCfg() {
  const o = {};
  for (const k in F) o[k] = F[k].type === "checkbox" ? F[k].checked : F[k].value;
  if (!F.remember.checked) o.pass = "";
  try { localStorage.setItem(STORE, JSON.stringify(o)); } catch (e) {}
}
function loadCfg() {
  let o;
  try { o = JSON.parse(localStorage.getItem(STORE) || "{}"); } catch (e) { return; }
  for (const k in o) {
    const el = F[k];
    if (!el) continue;
    if (el.type === "checkbox") el.checked = !!o[k];
    else el.value = o[k];
  }
}
// mappa: nome leggibile in config.js → id del campo nel form
const DEFAULT_FIELDS = {
  host: "host", port: "port", path: "path", tls: "tls", username: "user", password: "pass",
  protocol: "proto", keepalive: "keepalive", reconnectMs: "reconnect", cleanSession: "clean",
  topicMove: "tMove", qos: "qos", retain: "retain", subscribe: "sub",
  format: "fmt", addType: "addType", templateMove: "tplMove", templateSpeed: "tplSpeed",
  rawMove: "rawMove", rawSpeed: "rawSpeed",
  rateHz: "rate", deadzone: "dz", heartbeatMs: "hb", onlyOnChange: "onchange",
  invertY: "invY"
};
function applyDefaults() {
  for (const k in DEFAULT_FIELDS) {
    const el = F[DEFAULT_FIELDS[k]], v = DEF[k];
    if (!el || v === undefined || v === null || v === "") continue;
    if (el.type === "checkbox") el.checked = !!v;
    else el.value = String(v);
  }
  // il topic della leva sta dentro lever, così sta vicino a min/max/step
  if (LV.topic) F.tSpeed.value = LV.topic;
  else if (DEF.topicSpeed) F.tSpeed.value = DEF.topicSpeed;
}

applyDefaults();          // prima il file di configurazione…
loadCfg();                // …poi quello che l'utente ha già scelto nel browser
if (!F.cid.value) F.cid.value = "joystick-" + Math.random().toString(16).slice(2, 8);

/* ── URL broker: host + porta + percorso + TLS ───────── */
const urlPreview = $("#urlPreview"), portWarn = $("#portWarn");

function brokerUrl() {
  const host = F.host.value.trim().replace(/\/+$/, "");
  if (!host) return "";
  const port = +F.port.value || 0;
  let path = F.path.value.trim();
  if (path && path[0] !== "/") path = "/" + path;
  return (F.tls.checked ? "wss://" : "ws://") + host + (port ? ":" + port : "") + path;
}

// nel campo host si può incollare anche un URL intero: viene spezzato nei campi
function absorbUrl() {
  const raw = F.host.value.trim();
  const m = raw.match(/^(?:(wss?|mqtts?|ssl|tls|tcp):\/\/)?([^\/:\s?#]+)(?::(\d+))?([\/?#]\S*)?$/i);
  if (!m) return;
  const scheme = m[1], host = m[2], port = m[3], path = m[4];
  if (!scheme && !port && !path) return;              // era già solo l'host
  F.host.value = host;
  if (scheme) F.tls.checked = /^(wss|mqtts|ssl|tls)$/i.test(scheme);
  if (port) F.port.value = port;
  if (path) F.path.value = path;
}

const TCP_PORTS = { 1883: "MQTT in chiaro", 8883: "MQTT su TLS" };
function refreshUrl() {
  urlPreview.textContent = brokerUrl() || "(manca l'host)";
  const p = +F.port.value;
  let warn = "";
  if (TCP_PORTS[p]) warn = "⚠ " + p + " è la porta " + TCP_PORTS[p] + " (TCP): dal browser serve quella WebSocket";
  else if (location.protocol === "https:" && !F.tls.checked) warn = "⚠ da HTTPS il browser blocca ws:// senza TLS";
  portWarn.textContent = warn;
  portWarn.style.color = warn ? "var(--accent-2)" : "";
}

/* ── log ─────────────────────────────────────────────── */
const logBox = $("#log");
let paused = false, logLines = 0;
function log(kind, msg, extra) {
  if (paused) return;
  const d = document.createElement("div");
  d.className = kind;
  const t = new Date();
  const hh = String(t.getHours()).padStart(2, "0"),
        mm = String(t.getMinutes()).padStart(2, "0"),
        ss = String(t.getSeconds()).padStart(2, "0");
  const k = { tx: "TX", rx: "RX", sys: "··", err: "!!" }[kind] || "··";
  d.innerHTML = '<time>' + hh + ':' + mm + ':' + ss + '</time><span class="k">' + k + '</span><span class="m"></span>';
  const m = d.lastChild;
  if (extra !== undefined) {
    const s = document.createElement("span");
    s.className = "t";
    s.textContent = msg + " ";
    m.appendChild(s);
    m.appendChild(document.createTextNode(extra));
  } else {
    m.textContent = msg;
  }
  const stick = logBox.scrollTop + logBox.clientHeight >= logBox.scrollHeight - 24;
  logBox.appendChild(d);
  if (++logLines > 250) { logBox.removeChild(logBox.firstChild); logLines--; }
  if (stick) logBox.scrollTop = logBox.scrollHeight;
}
$("#btnClear").onclick = () => { logBox.textContent = ""; logLines = 0; };
$("#btnPause").onclick = e => {
  paused = !paused;
  e.currentTarget.textContent = paused ? "Riprendi" : "Pausa";
  e.currentTarget.style.borderColor = paused ? "var(--accent-2)" : "";
};

/* ── topic: uno per lo stick, uno per la leva ─────────── */
function topics() {
  const move = F.tMove.value.trim(), speed = F.tSpeed.value.trim();
  return {
    move: move,
    speed: speed,
    sub: [...new Set([move, speed].filter(Boolean))]   // ci si riascolta per eco e RTT
  };
}
function refreshHint() {
  const T = topics();
  $("#topicHint").textContent = T.move || "(nessun topic)";
}

/* ── stato connessione ───────────────────────────────── */
let client = null, connected = false, subscribed = [];
const dot = $("#dot"), statusText = $("#statusText"), btnConnect = $("#btnConnect");
function setStatus(cls, text) {
  dot.className = "dot" + (cls ? " " + cls : "");
  statusText.textContent = text;
}

const stats = { sent: 0, rx: 0, window: [], rtt: null };

function pub(topic, payload, retain, quiet) {
  if (!client || !connected) return false;
  try {
    client.publish(topic, payload, { qos: +F.qos.value, retain: !!retain });
  } catch (e) {
    log("err", "publish: " + e.message);
    return false;
  }
  stats.sent++;
  stats.window.push(performance.now());
  if (!quiet) log("tx", topic, payload);
  return true;
}

function connect() {
  absorbUrl();
  refreshUrl();
  const url = brokerUrl();
  if (!url || /\s/.test(url)) { log("err", "host del broker mancante o non valido"); return; }
  if (location.protocol === "https:" && !F.tls.checked) {
    log("err", "Pagina in HTTPS: il browser blocca ws:// senza TLS. Attiva TLS e usa la porta WebSocket sicura del broker (spesso 8084 o 8884).");
    return;
  }
  if (TCP_PORTS[+F.port.value]) log("sys", "attenzione: " + F.port.value + " di solito è la porta MQTT su TCP, non WebSocket");
  if (typeof mqtt === "undefined") { log("err", "libreria mqtt.js non caricata (rete/CDN bloccati?)"); return; }

  const T = topics();
  if (!T.move) { log("err", "manca il topic movimento"); return; }
  const opts = {
    clientId: F.cid.value.trim() || "joystick-" + Math.random().toString(16).slice(2, 8),
    clean: F.clean.checked,
    keepalive: clamp(+F.keepalive.value || 0, 0, 65535),
    reconnectPeriod: clamp(+F.reconnect.value || 0, 0, 60000),
    connectTimeout: 8000,
    protocolVersion: +F.proto.value || 4
  };
  if (opts.protocolVersion === 3) opts.protocolId = "MQIsdp";
  if (F.user.value) opts.username = F.user.value;
  if (F.pass.value) opts.password = F.pass.value;

  setStatus("wait", "connessione…");
  btnConnect.textContent = "ANNULLA";
  log("sys", "connessione a " + url + " (" + opts.clientId + ")");

  try { client = mqtt.connect(url, opts); }
  catch (e) { log("err", e.message); setStatus("err", "errore"); btnConnect.textContent = "CONNETTI"; client = null; return; }

  client.on("connect", () => {
    connected = true;
    lastKey = null; lastSpeedKey = null;
    setStatus("on", "connesso");
    btnConnect.textContent = "DISCONNETTI";
    log("sys", "connesso · move → " + T.move);
    if (F.sub.checked && T.sub.length) {
      client.subscribe(T.sub, { qos: +F.qos.value }, err => {
        if (err) log("err", "subscribe: " + err.message);
        else { subscribed = T.sub.slice(); log("sys", "sottoscritto a " + T.sub.join(", ")); }
      });
    }
    startTimer();
  });

  client.on("reconnect", () => { connected = false; setStatus("wait", "riconnessione…"); });
  client.on("offline",  () => { connected = false; setStatus("wait", "offline"); });
  client.on("close",    () => {
    if (connected) log("sys", "connessione chiusa");
    connected = false;
    if (client) setStatus("wait", "chiuso");
  });
  client.on("error", e => { log("err", (e && e.message) || String(e)); setStatus("err", "errore"); });

  client.on("message", (topic, payload) => {
    stats.rx++;
    const s = payload.toString();
    if (s.charCodeAt(0) === 123 /* { */) {
      try {
        const o = JSON.parse(s);
        if (typeof o.t === "number") stats.rtt = clamp(Date.now() - o.t, 0, 99999);
      } catch (e) {}
    }
    log("rx", topic, s);
  });
}

function disconnect() {
  const T = topics();
  if (client && connected) {
    zeroAll();
    if (T.move) pub(T.move, movePayload(0, 0, "off").payload, F.retain.checked);
  }
  stopTimer();
  if (client) { try { client.end(false); } catch (e) { try { client.end(true); } catch (e2) {} } }
  client = null;
  connected = false;
  subscribed = [];
  setStatus("", "disconnesso");
  btnConnect.textContent = "CONNETTI";
  log("sys", "disconnesso");
}

btnConnect.onclick = () => { saveCfg(); client ? disconnect() : connect(); };
$("#btnReset").onclick = () => {
  try { localStorage.removeItem(STORE); } catch (e) {}
  location.reload();
};
$("#preset").onchange = e => {
  if (!e.target.value) return;
  const p = e.target.value.split("|");
  F.host.value = p[0];
  F.port.value = p[1];
  F.path.value = p[2];
  F.tls.checked = p[3] === "1";
  e.target.value = "";
  refreshUrl();
  saveCfg();
};

/* ── input: pad ──────────────────────────────────────── */
const pad = $("#pad"), knob = $("#knob"), vecLine = $("#vecLine"), dzCircle = $("#dzCircle");
let padActive = false, padId = null;
const padVec = { x: 0, y: 0 };

function padUpdate(ev) {
  const rect = pad.getBoundingClientRect();
  const R = (rect.width - knob.offsetWidth) / 2 || 1;
  let x = (ev.clientX - (rect.left + rect.width / 2)) / R;
  let y = -(ev.clientY - (rect.top + rect.height / 2)) / R;
  const m = Math.hypot(x, y);
  if (m > 1) { x /= m; y /= m; }
  padVec.x = x; padVec.y = y;
}
pad.addEventListener("pointerdown", ev => {
  if (padId !== null) return;
  padId = ev.pointerId;
  padActive = true;
  pad.classList.add("live");
  try { pad.setPointerCapture(padId); } catch (e) {}
  padUpdate(ev);
  ev.preventDefault();
});
pad.addEventListener("pointermove", ev => { if (ev.pointerId === padId) { padUpdate(ev); ev.preventDefault(); } });
function padRelease(ev) {
  if (ev.pointerId !== padId) return;
  try { pad.releasePointerCapture(padId); } catch (e) {}
  padId = null; padActive = false;
  padVec.x = padVec.y = 0;
  pad.classList.remove("live");
}
pad.addEventListener("pointerup", padRelease);
pad.addEventListener("pointercancel", padRelease);
pad.addEventListener("lostpointercapture", padRelease);
pad.addEventListener("contextmenu", e => e.preventDefault());

/* ── input: tastiera ─────────────────────────────────── */
const keys = new Set();
const keyVec = { x: 0, y: 0 };
const AX = CFG.axis;
const LVKEYS = { up: LV.keys.up || [], down: LV.keys.down || [], zero: LV.keys.zero || [] };
const LEVERKEYS = [].concat(LVKEYS.up, LVKEYS.down, LVKEYS.zero);
const DIRKEYS = { up: AX.up || [], down: AX.down || [], left: AX.left || [], right: AX.right || [] };
const MOVEKEYS = [].concat(DIRKEYS.up, DIRKEYS.down, DIRKEYS.left, DIRKEYS.right);
const STOPKEYS = CFG.stopKeys;
const held = dir => DIRKEYS[dir].some(c => keys.has(c)) ? 1 : 0;

function typingIn(t) { return !!t && t.nodeType === 1 && t.matches("input,select,textarea,[contenteditable]"); }
function activatable(t) { return !!t && t.nodeType === 1 && t.matches("button,summary,a,[role=button]"); }

addEventListener("keydown", e => {
  if (typingIn(e.target)) return;
  // se il focus è su un pulsante lascio che Spazio/Invio lo attivino (comportamento nativo)
  if (activatable(e.target) && (STOPKEYS.includes(e.code) || e.code === "Enter")) return;
  if (e.repeat) {
    if (MOVEKEYS.includes(e.code) || STOPKEYS.includes(e.code)) { e.preventDefault(); return; }
    if (LVKEYS.up.includes(e.code))   { e.preventDefault(); nudgeLever(+leverStep()); return; }
    if (LVKEYS.down.includes(e.code)) { e.preventDefault(); nudgeLever(-leverStep()); return; }
    return;
  }
  if (STOPKEYS.includes(e.code)) { e.preventDefault(); panic(); return; }
  if (MOVEKEYS.includes(e.code)) { keys.add(e.code); e.preventDefault(); return; }
  if (LVKEYS.up.includes(e.code))   { e.preventDefault(); nudgeLever(+leverStep()); return; }
  if (LVKEYS.down.includes(e.code)) { e.preventDefault(); nudgeLever(-leverStep()); return; }
  if (LVKEYS.zero.includes(e.code)) { e.preventDefault(); setLever(LV.min); return; }
  if ((RV.keys || []).includes(e.code)) { e.preventDefault(); toggleDir(); }
});
addEventListener("keyup", e => {
  if (typingIn(e.target)) return;
  if (MOVEKEYS.includes(e.code)) keys.delete(e.code);
});

function keyTick() {
  const tx = held("right") - held("left");
  const ty = held("up") - held("down");
  const n = Math.hypot(tx, ty) || 1;
  const gx = tx / n, gy = ty / n;
  const k = clamp(+AX.keyRamp || 0.28, 0.05, 1);   // rampa morbida
  keyVec.x += (gx - keyVec.x) * k;
  keyVec.y += (gy - keyVec.y) * k;
  if (Math.abs(keyVec.x) < 1e-3) keyVec.x = 0;
  if (Math.abs(keyVec.y) < 1e-3) keyVec.y = 0;
}

/* ── input: gamepad ──────────────────────────────────── */
const gpVec = { x: 0, y: 0 };
let gpActive = false, gpLast = performance.now(), gpRevPrev = false;
const badge = $("#gpBadge");

addEventListener("gamepadconnected", e => {
  badge.hidden = false;
  log("sys", "gamepad: " + e.gamepad.id);
});
addEventListener("gamepaddisconnected", () => {
  if (!(navigator.getGamepads() || []).some(Boolean)) { badge.hidden = true; gpActive = false; gpVec.x = gpVec.y = 0; }
  log("sys", "gamepad scollegato");
});

function gpTick() {
  const pads = navigator.getGamepads ? navigator.getGamepads() : [];
  let gp = null;
  for (const p of pads) if (p && p.connected) { gp = p; break; }
  if (!gp) { gpActive = false; return; }
  badge.hidden = false;

  const ax = AX.gamepadAxes || [0, 1];
  let x = gp.axes[ax[0]] || 0, y = -(gp.axes[ax[1]] || 0);
  const D = AX.gamepadDpad || {};
  const dp = i => i !== undefined && gp.buttons[i] && gp.buttons[i].pressed;
  if (dp(D.up) || dp(D.down) || dp(D.left) || dp(D.right)) {
    const dx = (dp(D.right) ? 1 : 0) - (dp(D.left) ? 1 : 0);
    const dy = (dp(D.up) ? 1 : 0) - (dp(D.down) ? 1 : 0);
    const n = Math.hypot(dx, dy) || 1;
    x = dx / n; y = dy / n;
  }
  const m = Math.hypot(x, y);
  gpActive = m > 0.08;
  gpVec.x = x; gpVec.y = y;

  // la leva si muove col grilletto o con l'asse indicato, a velocità costante
  const dt = Math.min(0.1, (performance.now() - gpLast) / 1000);
  gpLast = performance.now();
  const rate = (+LV.gamepadRate || 80) * dt;
  let delta = 0;
  const la = LV.gamepadAxis;
  if (la !== null && la !== undefined && gp.axes[la] !== undefined && Math.abs(gp.axes[la]) > 0.15) delta -= gp.axes[la] * rate;
  if (dp(LV.gamepadUp)) delta += rate;
  if (dp(LV.gamepadDown)) delta -= rate;
  if (delta) nudgeLever(delta);
  // tasto del gamepad che inverte la marcia, sul fronte di pressione
  const rb = RV.gamepadButton;
  if (rb !== null && rb !== undefined) {
    const now = dp(rb);
    if (now && !gpRevPrev) toggleDir();
    gpRevPrev = now;
  }
}

/* ── pulsanti su schermo, generati da config.js ──────── */
function keyLabel(code) {
  if (!code) return "";
  if (code.startsWith("Key")) return code.slice(3);
  if (code.startsWith("Digit")) return code.slice(5);
  if (code.startsWith("Numpad")) return "num" + code.slice(6);
  if (code.startsWith("Arrow")) return { Up: "↑", Down: "↓", Left: "←", Right: "→" }[code.slice(5)] || code;
  if (code === "Space") return "spazio";
  return code;
}

// legenda dei tasti, ricavata dalla configurazione
$("#padKeys").textContent = [DIRKEYS.up[0], DIRKEYS.left[0], DIRKEYS.down[0], DIRKEYS.right[0]]
  .filter(Boolean).map(keyLabel).join("");
$("#leverLbl").textContent = LV.label || "velocità";
$("#leverKeys").textContent = [
  LVKEYS.up[0] && keyLabel(LVKEYS.up[0]) + " su",
  LVKEYS.down[0] && keyLabel(LVKEYS.down[0]) + " giù",
  LVKEYS.zero[0] && keyLabel(LVKEYS.zero[0]) + " azzera",
  (LV.reverse && LV.reverse.keys && LV.reverse.keys[0]) && keyLabel(LV.reverse.keys[0]) + " marcia"
].filter(Boolean).join(" · ");

// dopo un click col mouse/dito tolgo il focus dal pulsante: così Spazio resta lo STOP
document.addEventListener("pointerup", e => {
  const b = e.target && e.target.closest && e.target.closest("button");
  if (b) b.blur();
});

/* ── levetta della velocità ──────────────────────────── */
const leverEl = $("#lever"), railEl = leverEl.querySelector(".rail"),
      fillEl = $("#leverFill"), handleEl = $("#leverHandle"), leverValEl = $("#leverVal");
let leverVal = clamp(+LV.start || 0, LV.min, LV.max);
let leverId = null;

const RV = LV.reverse || {};
const dirBtn = $("#dirBtn"), dirArrow = $("#dirArrow"), dirLabel = $("#dirLabel");
let dirFwd = RV.start === 0 ? 0 : 1;      // 1 = avanti · 0 = retromarcia

function renderDir() {
  const rev = dirFwd === 0;
  dirBtn.classList.toggle("rev", rev);
  leverEl.classList.toggle("rev", rev);
  dirBtn.setAttribute("aria-pressed", String(rev));
  dirArrow.textContent = rev ? "▼" : "▲";
  dirLabel.textContent = rev ? (RV.reverseLabel || "retro") : (RV.forwardLabel || "avanti");
}
function setDir(v) {
  const nv = v ? 1 : 0;
  if (nv === dirFwd) return;
  dirFwd = nv;
  renderDir();
  lastSpeedKey = null;                    // il cambio di marcia si vede subito
  speedTick(true);
}
function toggleDir() { setDir(dirFwd ? 0 : 1); }
dirBtn.addEventListener("click", toggleDir);

function leverStep() { return +LV.step || 1; }
function leverNorm() { return (leverVal - LV.min) / (LV.max - LV.min); }   // 0..1
function setLever(v) {
  const nv = clamp(Math.round(v * 1000) / 1000, LV.min, LV.max);
  if (nv === leverVal) return;
  leverVal = nv;
  renderLever();
}
function nudgeLever(d) { setLever(leverVal + d); }
function renderLever() {
  const p = leverNorm();
  fillEl.style.height = (p * 100) + "%";
  handleEl.style.bottom = "calc(" + (p * 100) + "% - " + (handleEl.offsetHeight / 2) + "px)";
  const shown = Math.round(leverVal) + (LV.unit || "");
  leverValEl.textContent = shown;
  oSpeed.textContent = shown;
  leverEl.setAttribute("aria-valuemin", LV.min);
  leverEl.setAttribute("aria-valuemax", LV.max);
  leverEl.setAttribute("aria-valuenow", leverVal);
}
function leverFromPointer(ev) {
  const r = railEl.getBoundingClientRect();
  const p = clamp(1 - (ev.clientY - r.top) / r.height, 0, 1);
  setLever(LV.min + p * (LV.max - LV.min));
}
leverEl.addEventListener("pointerdown", ev => {
  if (leverId !== null) return;
  leverId = ev.pointerId;
  leverEl.classList.add("live");
  try { leverEl.setPointerCapture(leverId); } catch (e) {}
  leverFromPointer(ev);
  ev.preventDefault();
});
leverEl.addEventListener("pointermove", ev => { if (ev.pointerId === leverId) { leverFromPointer(ev); ev.preventDefault(); } });
function leverRelease(ev) {
  if (ev.pointerId !== leverId) return;
  try { leverEl.releasePointerCapture(leverId); } catch (e) {}
  leverId = null;
  leverEl.classList.remove("live");
  if (LV.spring) setLever(LV.min);
}
leverEl.addEventListener("pointerup", leverRelease);
leverEl.addEventListener("pointercancel", leverRelease);
leverEl.addEventListener("lostpointercapture", leverRelease);
leverEl.addEventListener("contextmenu", e => e.preventDefault());
leverEl.addEventListener("wheel", ev => { ev.preventDefault(); nudgeLever(ev.deltaY < 0 ? leverStep() : -leverStep()); }, { passive: false });
leverEl.addEventListener("keydown", ev => {
  const k = { ArrowUp: 1, ArrowRight: 1, ArrowDown: -1, ArrowLeft: -1 }[ev.key];
  if (k) { ev.preventDefault(); nudgeLever(k * leverStep()); }
  else if (ev.key === "Home") { ev.preventDefault(); setLever(LV.max); }
  else if (ev.key === "End") { ev.preventDefault(); setLever(LV.min); }
});
// tacche di riferimento
(() => {
  const t = $("#leverTicks");
  for (let i = 0; i <= 10; i++) {
    const d = document.createElement("i");
    d.style.bottom = (i * 10) + "%";
    if (i % 5 === 0) d.className = "big";
    t.appendChild(d);
  }
})();

/* ── STOP ────────────────────────────────────────────── */
function zeroAll() {
  keys.clear();
  keyVec.x = keyVec.y = 0;
  padVec.x = padVec.y = 0;
  padActive = false; padId = null;
  pad.classList.remove("live");
}
function panic() {
  zeroAll();
  const T = topics();
  const p = movePayload(0, 0, "stop");
  setLever(LV.min);                       // la manetta torna a zero
  if (T.move && pub(T.move, p.payload, F.retain.checked)) lastKey = p.key;
  speedTick(true);                        // e la velocità a zero viene pubblicata subito
}
$("#stop").addEventListener("pointerdown", ev => { ev.preventDefault(); panic(); });

addEventListener("blur", zeroAll);
document.addEventListener("visibilitychange", () => { if (document.hidden) zeroAll(); });
addEventListener("pagehide", () => { if (client && connected) { try { client.end(true); } catch (e) {} } });

/* ── vettore corrente + payload ──────────────────────── */
function rawVec() {
  if (padActive) return { x: padVec.x, y: padVec.y, src: "pad" };
  if (gpActive)  return { x: gpVec.x,  y: gpVec.y,  src: "gamepad" };
  if (keyVec.x || keyVec.y) return { x: keyVec.x, y: keyVec.y, src: "tastiera" };
  return { x: 0, y: 0, src: "idle" };
}
function outVec() {
  const v = rawVec();
  let x = v.x, y = v.y;
  let m = Math.hypot(x, y);
  if (m > 1) { x /= m; y /= m; m = 1; }
  const dz = clamp((+F.dz.value || 0) / 100, 0, 0.9);
  if (m <= dz) { x = 0; y = 0; m = 0; }
  else if (dz > 0) { const s = ((m - dz) / (1 - dz)) / m; x *= s; y *= s; m = Math.hypot(x, y); }
  const lim = LV.scalesStick ? leverNorm() : 1;
  x *= lim; y *= lim; m *= lim;
  if (F.invY.checked) y = -y;
  return { x: r3(x), y: r3(y), m: r3(m), src: v.src };
}

const DIRS = ["right","up-right","up","up-left","left","down-left","down","down-right"];
const pct = v => Math.round(v * 100);

// tutte le grandezze disponibili ai template
function moveVals(x, y, src, t) {
  const m = Math.min(1, Math.hypot(x, y));
  const a = m > 0 ? Math.round(Math.atan2(y, x) * 180 / Math.PI) : 0;
  const l = r3(clamp(y + x, -1, 1)), r = r3(clamp(y - x, -1, 1));
  return {
    x: r3(x), y: r3(y), m: r3(m), a: a, l: l, r: r, src: src, t: t,
    heading: m > 0 ? DIRS[Math.round(((a + 360) % 360) / 45) % 8] : "stop",
    xi: pct(x), yi: pct(y), mi: pct(m), li: pct(l), ri: pct(r),
    speed: r3(leverVal), speedi: Math.round(leverVal), speedn: r3(leverNorm()),
    dir: dirFwd
  };
}
function fillTpl(tpl, vals) {
  return String(tpl).replace(/\{(\w+)\}/g, (s, k) => (k in vals ? vals[k] : s));
}

function movePayload(x, y, src) {
  const v = moveVals(x, y, src, Date.now());
  const withType = F.addType.checked;
  switch (F.fmt.value) {
    case "csv": {
      const key = fx(v.x) + "," + fx(v.y);
      return { payload: key, key: key };
    }
    case "dir":
      return { payload: v.heading, key: v.heading };
    case "tank": {
      const o = withType ? { type: "move", l: v.l, r: v.r, t: v.t } : { l: v.l, r: v.r, t: v.t };
      return { payload: JSON.stringify(o), key: "t" + v.l + "," + v.r };
    }
    case "raw":
      return { payload: F.rawMove.value, key: "raw:" + F.rawMove.value };
    case "custom": {
      const tpl = F.tplMove.value;
      const noT = Object.assign({}, v, { t: 0 });   // chiave = payload senza timestamp
      return { payload: fillTpl(tpl, v), key: fillTpl(tpl, noT) };
    }
    default: {
      const o = withType
        ? { type: "move", x: v.x, y: v.y, m: v.m, a: v.a, src: v.src, t: v.t }
        : { x: v.x, y: v.y, m: v.m, a: v.a, src: v.src, t: v.t };
      return { payload: JSON.stringify(o), key: fx(v.x) + "," + fx(v.y) };
    }
  }
}

function speedPayload() {
  const t = Date.now();
  const fmt = F.fmt.value;
  const v = outVec();
  const vals = moveVals(v.x, v.y, v.src, t);
  switch (fmt) {
    case "csv":
    case "dir": return vals.speedi + "," + vals.dir;
    case "raw": return F.rawSpeed.value;
    case "custom": return fillTpl(F.tplSpeed.value, vals);
    default: return JSON.stringify(F.addType.checked
      ? { type: "speed", speed: vals.speed, dir: vals.dir, t: t }
      : { speed: vals.speed, dir: vals.dir, t: t });
  }
}

/* ── timer di pubblicazione ──────────────────────────── */
let timer = null, lastKey = null, lastPubAt = 0, lastTxLog = 0, wasNeutral = true;
function startTimer() {
  stopTimer();
  const hz = clamp(+F.rate.value || 20, 1, 100);
  timer = setInterval(() => { tick(); speedTick(); }, 1000 / hz);
}
function stopTimer() { if (timer) { clearInterval(timer); timer = null; } }

function tick() {
  if (!client || !connected) return;
  const T = topics();
  if (!T.move) return;
  const v = outVec();
  const p = movePayload(v.x, v.y, v.src);
  const now = performance.now();
  const hb = +F.hb.value || 0;
  const send = !F.onchange.checked || p.key !== lastKey || (hb > 0 && now - lastPubAt >= hb);
  if (!send) return;
  // il log si limita da solo (5 righe/s), ma l'arresto si vede sempre
  const stopping = v.m === 0 && !wasNeutral;
  const quiet = now - lastTxLog < 200 && !stopping;
  if (pub(T.move, p.payload, F.retain.checked, quiet)) {
    lastKey = p.key;
    lastPubAt = now;
    wasNeutral = v.m === 0;
    if (!quiet) lastTxLog = now;
  }
}

// la leva ha un ritmo suo: pubblica quando cambia (e a ogni heartbeat)
let lastSpeedKey = null, lastSpeedAt = 0;
function speedTick(force) {
  if (!client || !connected) return;
  const T = topics();
  if (!T.speed) return;
  const payload = speedPayload();
  const key = Math.round(leverVal) + ":" + dirFwd;
  const now = performance.now();
  const hb = +F.hb.value || 0;
  // la leva è un valore impostato, non un flusso: niente raffica anche in modalità continua
  if (!force && key === lastSpeedKey && !(hb > 0 && now - lastSpeedAt >= hb)) return;
  if (pub(T.speed, payload, F.retain.checked)) { lastSpeedKey = key; lastSpeedAt = now; }
}

/* ── render ──────────────────────────────────────────── */
const oX = $("#oX"), oY = $("#oY"), oM = $("#oM"), oA = $("#oA"), oSrc = $("#oSrc"),
      oRate = $("#oRate"), oSent = $("#oSent"), oRtt = $("#oRtt"),
      mL = $("#mL"), mR = $("#mR"), oSpeed = $("#oSpeed");

function bar(el, v) {
  const w = Math.abs(v) * 50;
  el.style.width = w + "%";
  el.style.left = v >= 0 ? "50%" : (50 - w) + "%";
}

function render() {
  keyTick();
  gpTick();

  const raw = rawVec();
  const rect = pad.getBoundingClientRect();
  const R = (rect.width - knob.offsetWidth) / 2 || 0;
  knob.style.transform = "translate(-50%,-50%) translate(" + (raw.x * R).toFixed(1) + "px," + (-raw.y * R).toFixed(1) + "px)";
  vecLine.setAttribute("x2", raw.x.toFixed(3));
  vecLine.setAttribute("y2", (-raw.y).toFixed(3));
  pad.classList.toggle("live", padActive || raw.src === "gamepad" || raw.src === "tastiera");

  const v = outVec();
  oX.textContent = fx(v.x);
  oY.textContent = fx(v.y);
  oM.textContent = fx(v.m);
  oA.textContent = v.m > 0 ? Math.round(Math.atan2(v.y, v.x) * 180 / Math.PI) + "°" : "—";
  oSrc.textContent = v.src;
  const stalled = LV.scalesStick && leverNorm() === 0 && Math.hypot(raw.x, raw.y) > 0.05;
  oSpeed.style.color = stalled ? "var(--danger)" : "";
  oSpeed.title = stalled ? "velocità a zero: lo stick non produce movimento" : "";
  bar(mL, clamp(v.y + v.x, -1, 1));
  bar(mR, clamp(v.y - v.x, -1, 1));

  const now = performance.now();
  while (stats.window.length && now - stats.window[0] > 1000) stats.window.shift();
  oRate.textContent = stats.window.length;
  oSent.textContent = stats.sent;
  oRtt.textContent = stats.rtt === null ? "—" : stats.rtt + " ms";

  requestAnimationFrame(render);
}
requestAnimationFrame(render);

/* ── invio manuale: client MQTT a tutti gli effetti ──── */
const pubPayload = $("#pubPayload");
function manualPub() {
  const topic = F.pubTopic.value.trim();
  if (!topic) { log("err", "invio manuale: manca il topic"); return; }
  if (!connected) { log("err", "invio manuale: non sei connesso"); return; }
  pub(topic, pubPayload.value, F.pubRetain.checked);
}
$("#btnPub").onclick = manualPub;
pubPayload.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); manualPub(); } });
F.pubTopic.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); manualPub(); } });

/* ── reattività config ───────────────────────────────── */
function resubscribe() {
  if (!client || !connected) return;
  if (subscribed.length) { try { client.unsubscribe(subscribed); } catch (e) {} }
  subscribed = [];
  const T = topics();
  if (!F.sub.checked || !T.sub.length) { log("sys", "sottoscrizioni rimosse"); return; }
  client.subscribe(T.sub, { qos: +F.qos.value }, err => {
    if (err) log("err", "subscribe: " + err.message);
    else { subscribed = T.sub.slice(); log("sys", "sottoscritto a " + T.sub.join(", ")); }
  });
}
function syncFmtUI() {
  const f = F.fmt.value;
  $("#fTplMove").hidden = $("#fTplSpeed").hidden = f !== "custom";
  $("#fRawMove").hidden = $("#fRawSpeed").hidden = f !== "raw";
  F.addType.closest(".f").hidden = f !== "json" && f !== "tank";   // il campo type vale solo per i JSON
}
const NEEDS_RECONNECT = ["host", "port", "path", "tls", "cid", "user", "pass", "proto", "keepalive", "reconnect", "clean"];
const URL_FIELDS = ["host", "port", "path", "tls"];

for (const k in F) {
  const handler = () => {
    if (k === "host") absorbUrl();
    if (URL_FIELDS.includes(k)) refreshUrl();
    saveCfg();
    refreshHint();
    if (k === "rate" && timer) startTimer();
    if (["fmt","addType","tplMove","tplSpeed","rawMove","rawSpeed","tMove","retain"].includes(k)) lastKey = null;
    if (["fmt","addType","tplSpeed","rawSpeed","tSpeed"].includes(k)) lastSpeedKey = null;
    if (k === "fmt") syncFmtUI();
    if (k === "dz") dzCircle.setAttribute("r", String(clamp((+F.dz.value || 0) / 100, 0, 0.9) || 0.001));
    if (k === "sub" || k === "tMove" || k === "tSpeed") resubscribe();
    if (NEEDS_RECONNECT.includes(k) && client) log("sys", "modifica applicata alla prossima connessione");
  };
  F[k].addEventListener("change", handler);
  if (F[k].type === "text" || F[k].type === "password" || F[k].type === "number") {
    F[k].addEventListener("input", () => { refreshHint(); if (URL_FIELDS.includes(k)) refreshUrl(); });
  }
}


refreshHint();
refreshUrl();
syncFmtUI();
renderLever();
renderDir();
dzCircle.setAttribute("r", String(clamp((+F.dz.value || 0) / 100, 0, 0.9) || 0.001));
if (!F.pubTopic.value) F.pubTopic.value = topics().btn || topics().move;
// segnala le sovrapposizioni in config.js invece di ignorarle in silenzio
function checkConfig() {
  for (const code of (RV.keys || [])) {
    if (MOVEKEYS.includes(code)) log("err", "config.js: " + code + " serve sia allo stick sia alla retromarcia: vince lo stick");
    else if (LEVERKEYS.includes(code)) log("err", "config.js: " + code + " è sia un tasto della leva sia la retromarcia: vince la leva");
  }
  for (const code of LEVERKEYS) {
    if (MOVEKEYS.includes(code)) log("err", "config.js: " + code + " serve sia allo stick sia alla leva: vince lo stick");
    else if (STOPKEYS.includes(code)) log("err", "config.js: " + code + " è sia STOP sia un tasto della leva: vince STOP");
  }
  for (const code of STOPKEYS) {
    if (MOVEKEYS.includes(code)) log("err", "config.js: " + code + " è sia STOP sia un tasto dello stick: vince STOP");
  }
  if (!(LV.max > LV.min)) log("err", "config.js: la scala della leva non è valida (max deve superare min)");
  if (!window.JOYSTICK_CONFIG) log("err", "config.js non caricato: uso la configurazione di riserva");
}
checkConfig();

log("sys", "pronto — configura il broker e premi CONNETTI");
if (location.protocol === "https:") {
  log("sys", "pagina in HTTPS: sono ammessi solo broker wss://");
} else {
  $("#protoTip").innerHTML = 'Pagina servita in <code>' + location.protocol +
    '</code>: puoi usare anche broker <code>ws://</code> in chiaro, per esempio un mosquitto in LAN con <code>listener 9001 / protocol websockets</code>.';
}


})();
