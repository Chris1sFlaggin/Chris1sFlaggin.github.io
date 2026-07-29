(() => {
"use strict";


/* ── configurazione (config.js) ──────────────────────── */
const FALLBACK_CONFIG = {
  steer: {
    topic: "", label: "angolo", unit: "°", min: -90, max: 90, center: 0, start: 0, step: 5,
    spring: true, rate: 180,
    keys: { left: ["KeyA", "ArrowLeft"], right: ["KeyD", "ArrowRight"], center: ["KeyS", "ArrowDown"] },
    gamepadAxis: 0, gamepadDeadzone: 0.12
  },
  lever: {
    topic: "", label: "velocità", unit: "", min: -100, max: 100, center: 0, start: 0, step: 5,
    spring: false,
    keys: { up: ["KeyR"], down: ["KeyF"], zero: ["KeyZ"] },
    gamepadAxis: 3, gamepadUp: 7, gamepadDown: 6, gamepadRate: 80
  },
  stopKeys: ["Space"],
  video: { topic: "", enabled: true, chunkHeader: 4, fit: "contain", mirror: false, flip: false, staleMs: 2000 },
  defaults: {}
};
const CFG = Object.assign({}, FALLBACK_CONFIG, window.JOYSTICK_CONFIG || {});
CFG.steer = Object.assign({}, FALLBACK_CONFIG.steer, CFG.steer || {});
CFG.steer.keys = Object.assign({}, FALLBACK_CONFIG.steer.keys, CFG.steer.keys || {});
CFG.lever = Object.assign({}, FALLBACK_CONFIG.lever, CFG.lever || {});
CFG.lever.keys = Object.assign({}, FALLBACK_CONFIG.lever.keys, CFG.lever.keys || {});
CFG.video = Object.assign({}, FALLBACK_CONFIG.video, CFG.video || {});
const ST = CFG.steer, LV = CFG.lever, VD = CFG.video;
if (!(ST.max > ST.min)) { ST.min = -90; ST.max = 90; }
if (!(LV.max > LV.min)) { LV.min = 0; LV.max = 100; }
CFG.stopKeys = CFG.stopKeys && CFG.stopKeys.length ? CFG.stopKeys : FALLBACK_CONFIG.stopKeys;
const DEF = CFG.defaults || {};

/* ── helpers ─────────────────────────────────────────── */
const $ = (s, r = document) => r.querySelector(s);
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

/* ── form refs (chiavi = id) ─────────────────────────── */
const F = {};
for (const id of ["host","port","path","tls","user","pass","cid","proto","keepalive","reconnect","clean",
                  "tMove","tSpeed","qos","sub","retain",
                  "tVideo","vidOn","vidFit",
                  "fmt","addType","tplMove","tplSpeed","rawMove","rawSpeed",
                  "rate","hb","onchange","remember","pubTopic","pubRetain"]) {
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
  rateHz: "rate", heartbeatMs: "hb", onlyOnChange: "onchange"
};
function applyDefaults() {
  for (const k in DEFAULT_FIELDS) {
    const el = F[DEFAULT_FIELDS[k]], v = DEF[k];
    if (!el || v === undefined || v === null || v === "") continue;
    if (el.type === "checkbox") el.checked = !!v;
    else el.value = String(v);
  }
  // il topic della leva velocità sta dentro lever, così sta vicino a min/max/step
  if (LV.topic) F.tSpeed.value = LV.topic;
  else if (DEF.topicSpeed) F.tSpeed.value = DEF.topicSpeed;
  // e quello dello sterzo può stare dentro steer (di default = topic movimento)
  if (ST.topic) F.tMove.value = ST.topic;
  // il video ha una sezione tutta sua in config.js
  if (F.tVideo) {
    if (VD.topic) F.tVideo.value = VD.topic;
    else if (DEF.topicVideo) F.tVideo.value = DEF.topicVideo;
  }
  if (F.vidOn) F.vidOn.checked = VD.enabled !== false;
  if (F.vidFit) F.vidFit.value = VD.fit === "cover" ? "cover" : "contain";
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

/* ── topic: sterzo, velocità e il video in arrivo ─────── */
function videoTopic() { return F.tVideo ? F.tVideo.value.trim() : ""; }
function topics() {
  const move = F.tMove.value.trim(), speed = F.tSpeed.value.trim(), video = videoTopic();
  // eco: ci si riascolta sui propri topic per il log e per l'RTT
  const echo = F.sub.checked ? [...new Set([move, speed].filter(Boolean))] : [];
  // video: sottoscrizione a parte, sempre a QoS 0 (i fotogrammi sono grossi)
  const vid = (video && (!F.vidOn || F.vidOn.checked) && !echo.includes(video)) ? [video] : [];
  return { move: move, speed: speed, video: video, echo: echo, vid: vid };
}
function refreshHint() {
  const T = topics();
  $("#topicHint").textContent = T.move || "(nessun topic)";
}

/* ── stato connessione ───────────────────────────────── */
let client = null, connected = false, subscribed = [];
const dot = $("#dot"), dot2 = $("#dot2"), statusText = $("#statusText"), btnConnect = $("#btnConnect");
function setStatus(cls, text) {
  dot.className = "dot" + (cls ? " " + cls : "");
  if (dot2) dot2.className = "dot ovdot" + (cls ? " " + cls : "");   // il gemello sopra il video
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
    log("sys", "connesso · sterzo → " + T.move);
    subscribed = [];
    subscribeAll();
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
    // i fotogrammi hanno una corsia tutta loro: né toString né log
    if (topic === videoTopic()) {
      if (!F.vidOn || F.vidOn.checked) onFrame(payload);
      return;
    }
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
    if (T.move) pub(T.move, movePayload("off").payload, F.retain.checked);
  }
  stopTimer();
  videoIdle(false);
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

/* ── tasti ───────────────────────────────────────────── */
const STKEYS = { left: ST.keys.left || [], right: ST.keys.right || [], center: ST.keys.center || [] };
const STEERKEYS = [].concat(STKEYS.left, STKEYS.right, STKEYS.center);
const LVKEYS = { up: LV.keys.up || [], down: LV.keys.down || [], zero: LV.keys.zero || [] };
const LEVERKEYS = [].concat(LVKEYS.up, LVKEYS.down, LVKEYS.zero);
const STOPKEYS = CFG.stopKeys;
const steerHeld = new Set();

function typingIn(t) { return !!t && t.nodeType === 1 && t.matches("input,select,textarea,[contenteditable]"); }
function activatable(t) { return !!t && t.nodeType === 1 && t.matches("button,summary,a,[role=button]"); }
const isSteerMove = c => STKEYS.left.includes(c) || STKEYS.right.includes(c);

addEventListener("keydown", e => {
  if (e.code === "Escape" && document.body.classList.contains("immersive")) { setImmersive(false); return; }
  if (typingIn(e.target)) return;
  // se il focus è su un pulsante lascio che Spazio/Invio lo attivino (comportamento nativo)
  if (activatable(e.target) && (STOPKEYS.includes(e.code) || e.code === "Enter")) return;
  if (e.repeat) {
    if (isSteerMove(e.code) || STOPKEYS.includes(e.code)) { e.preventDefault(); return; }
    if (LVKEYS.up.includes(e.code))   { e.preventDefault(); nudgeLever(+leverStep()); return; }
    if (LVKEYS.down.includes(e.code)) { e.preventDefault(); nudgeLever(-leverStep()); return; }
    return;
  }
  if (STOPKEYS.includes(e.code)) { e.preventDefault(); panic(); return; }
  if (isSteerMove(e.code)) { steerHeld.add(e.code); e.preventDefault(); return; }
  if (STKEYS.center.includes(e.code)) { e.preventDefault(); setSteer(centerVal()); return; }
  if (LVKEYS.up.includes(e.code))   { e.preventDefault(); nudgeLever(+leverStep()); return; }
  if (LVKEYS.down.includes(e.code)) { e.preventDefault(); nudgeLever(-leverStep()); return; }
  if (LVKEYS.zero.includes(e.code)) { e.preventDefault(); setLever(centerLV()); return; }
});
addEventListener("keyup", e => {
  if (typingIn(e.target)) return;
  if (isSteerMove(e.code)) steerHeld.delete(e.code);
});

/* ── input: gamepad ──────────────────────────────────── */
let gpActive = false, gpLast = performance.now(), gpSteerAxis = null;
const badge = $("#gpBadge");

addEventListener("gamepadconnected", e => {
  badge.hidden = false;
  log("sys", "gamepad: " + e.gamepad.id);
});
addEventListener("gamepaddisconnected", () => {
  if (!(navigator.getGamepads() || []).some(Boolean)) { badge.hidden = true; gpActive = false; gpSteerAxis = null; }
  log("sys", "gamepad scollegato");
});

function gpTick() {
  const pads = navigator.getGamepads ? navigator.getGamepads() : [];
  let gp = null;
  for (const p of pads) if (p && p.connected) { gp = p; break; }
  if (!gp) { gpActive = false; gpSteerAxis = null; return; }
  badge.hidden = false;
  gpActive = true;
  const dp = i => i !== undefined && gp.buttons[i] && gp.buttons[i].pressed;

  // sterzo: asse orizzontale, assoluto
  const sa = ST.gamepadAxis, dzn = +ST.gamepadDeadzone || 0.12;
  gpSteerAxis = (sa !== null && sa !== undefined && gp.axes[sa] !== undefined && Math.abs(gp.axes[sa]) > dzn)
    ? clamp(gp.axes[sa], -1, 1) : null;

  // leva velocità: grilletto o asse indicato, a velocità costante
  const dt = Math.min(0.1, (performance.now() - gpLast) / 1000);
  gpLast = performance.now();
  const rate = (+LV.gamepadRate || 80) * dt;
  let delta = 0;
  const la = LV.gamepadAxis;
  if (la !== null && la !== undefined && gp.axes[la] !== undefined && Math.abs(gp.axes[la]) > 0.15) delta -= gp.axes[la] * rate;
  if (dp(LV.gamepadUp)) delta += rate;
  if (dp(LV.gamepadDown)) delta -= rate;
  if (delta) nudgeLever(delta);
}

/* ── etichette dei tasti ─────────────────────────────── */
function keyLabel(code) {
  if (!code) return "";
  if (code.startsWith("Key")) return code.slice(3);
  if (code.startsWith("Digit")) return code.slice(5);
  if (code.startsWith("Numpad")) return "num" + code.slice(6);
  if (code.startsWith("Arrow")) return { Up: "↑", Down: "↓", Left: "←", Right: "→" }[code.slice(5)] || code;
  if (code === "Space") return "spazio";
  return code;
}

// dopo un click col mouse/dito tolgo il focus dal pulsante: così Spazio resta lo STOP
document.addEventListener("pointerup", e => {
  const b = e.target && e.target.closest && e.target.closest("button");
  if (b) b.blur();
});

/* ── levetta orizzontale — angolo ────────────────────── */
const steerEl = $("#steer"), steerRail = steerEl.querySelector(".hrail"),
      steerFill = $("#steerFill"), steerHandle = $("#steerHandle"), steerValEl = $("#steerVal");
function centerVal() { return Math.round(clamp(+ST.center || 0, ST.min, ST.max)); }
let steerRaw = clamp(ST.start != null ? +ST.start : centerVal(), ST.min, ST.max);
let steerVal = Math.round(steerRaw);   // valore pubblicato: sempre intero
let steerId = null, steerSrc = "idle";

function steerNorm() { return (steerVal - ST.min) / (ST.max - ST.min); }   // 0..1
function setSteerRaw(v) {
  steerRaw = clamp(v, ST.min, ST.max);
  const nv = Math.round(steerRaw);
  if (nv === steerVal) return;
  steerVal = nv;
  renderSteer();
}
function setSteer(v) { steerRaw = clamp(v, ST.min, ST.max); setSteerRaw(steerRaw); renderSteer(); }
function steerStep() { return +ST.step || 1; }
function renderSteer() {
  const p = steerNorm();
  const cp = (centerVal() - ST.min) / (ST.max - ST.min);
  const lo = Math.min(cp, p) * 100, hi = Math.max(cp, p) * 100;
  steerFill.style.left = lo + "%";
  steerFill.style.width = (hi - lo) + "%";
  steerHandle.style.left = "calc(" + (p * 100) + "% - " + (steerHandle.offsetWidth / 2) + "px)";
  steerValEl.textContent = steerVal + (ST.unit || "");
  steerEl.setAttribute("aria-valuemin", ST.min);
  steerEl.setAttribute("aria-valuemax", ST.max);
  steerEl.setAttribute("aria-valuenow", steerVal);
}
function steerFromPointer(ev) {
  const r = steerRail.getBoundingClientRect();
  const p = clamp((ev.clientX - r.left) / r.width, 0, 1);
  setSteer(ST.min + p * (ST.max - ST.min));
}
steerEl.addEventListener("pointerdown", ev => {
  if (steerId !== null) return;
  steerId = ev.pointerId;
  steerEl.classList.add("live");
  try { steerEl.setPointerCapture(steerId); } catch (e) {}
  steerFromPointer(ev);
  ev.preventDefault();
});
steerEl.addEventListener("pointermove", ev => { if (ev.pointerId === steerId) { steerFromPointer(ev); ev.preventDefault(); } });
function steerReleaseEv(ev) {
  if (ev.pointerId !== steerId) return;
  try { steerEl.releasePointerCapture(steerId); } catch (e) {}
  steerId = null;
  steerEl.classList.remove("live");
  if (ST.spring) setSteer(centerVal());
}
steerEl.addEventListener("pointerup", steerReleaseEv);
steerEl.addEventListener("pointercancel", steerReleaseEv);
steerEl.addEventListener("lostpointercapture", steerReleaseEv);
steerEl.addEventListener("contextmenu", e => e.preventDefault());
steerEl.addEventListener("wheel", ev => { ev.preventDefault(); nudgeSteer(ev.deltaY < 0 ? steerStep() : -steerStep()); }, { passive: false });
steerEl.addEventListener("keydown", ev => {
  const k = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 }[ev.key];
  if (k) { ev.preventDefault(); nudgeSteer(k * steerStep()); }
  else if (ev.key === "Home") { ev.preventDefault(); setSteer(ST.max); }
  else if (ev.key === "End") { ev.preventDefault(); setSteer(ST.min); }
  else if (ev.key === " " || ev.key === "Enter") { ev.preventDefault(); setSteer(centerVal()); }
});
function nudgeSteer(d) { setSteer(steerRaw + d); steerSrc = "manuale"; }

// per la tastiera/gamepad: aggiornamento continuo ogni frame
function steerFrame(dt) {
  if (steerId !== null) { steerSrc = "sterzo"; return; }
  if (gpSteerAxis !== null) { setSteer(ST.min + (gpSteerAxis + 1) / 2 * (ST.max - ST.min)); steerSrc = "gamepad"; return; }
  const d = (STKEYS.right.some(c => steerHeld.has(c)) ? 1 : 0) - (STKEYS.left.some(c => steerHeld.has(c)) ? 1 : 0);
  if (d) { setSteerRaw(steerRaw + d * (+ST.rate || (ST.max - ST.min)) * dt); steerSrc = "tastiera"; return; }
  if (ST.spring) setSteer(centerVal());
  steerSrc = "idle";
}

// tacche di riferimento orizzontali
(() => {
  const t = $("#steerTicks");
  for (let i = 0; i <= 10; i++) {
    const d = document.createElement("i");
    d.style.left = (i * 10) + "%";
    if (i % 5 === 0) d.className = "big";
    t.appendChild(d);
  }
})();

/* ── levetta verticale — velocità ────────────────────── */
const leverEl = $("#lever"), railEl = leverEl.querySelector(".rail"),
      fillEl = $("#leverFill"), handleEl = $("#leverHandle"), leverValEl = $("#leverVal");
let leverRaw = clamp(+LV.start || 0, LV.min, LV.max);   // accumulatore continuo
let leverVal = Math.round(leverRaw);                    // valore pubblicato: sempre intero
let leverId = null;

// verso di marcia ricavato dal segno della leva (nessun bottoncino)
function centerLV() { return Math.round(clamp(+LV.center || 0, LV.min, LV.max)); }
function leverDir() { return leverVal < centerLV() ? 0 : 1; }   // 0 = retro · 1 = avanti
function leverMag() { return Math.abs(leverVal - centerLV()); } // modulo, sempre ≥ 0

function leverStep() { return +LV.step || 1; }
function leverNorm() { return (leverVal - LV.min) / (LV.max - LV.min); }   // 0..1
function setLever(v) {
  leverRaw = clamp(v, LV.min, LV.max);
  const nv = Math.round(leverRaw);
  if (nv === leverVal) return;
  leverVal = nv;
  renderLever();
}
function nudgeLever(d) { setLever(leverRaw + d); }
function renderLever() {
  const p = leverNorm();
  const cp = (centerLV() - LV.min) / (LV.max - LV.min);   // frazione del centro
  const lo = Math.min(cp, p), hi = Math.max(cp, p);
  fillEl.style.bottom = (lo * 100) + "%";
  fillEl.style.height = ((hi - lo) * 100) + "%";
  leverEl.classList.toggle("rev", leverVal < centerLV());  // sotto il centro = rossa
  handleEl.style.bottom = "calc(" + (p * 100) + "% - " + (handleEl.offsetHeight / 2) + "px)";
  const shown = leverVal + (LV.unit || "");
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
  if (LV.spring) setLever(centerLV());
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

/* ── video: i fotogrammi che arrivano dalla camera ─────
   L'ESP32-CAM spezza ogni foto in più messaggi, ognuno con un'etichetta
   di 4 byte davanti ai dati: [frameId, totale, indice, riservato]. Qui i
   pezzi si rimettono insieme e il fotogramma si mostra solo quando è
   completo; se ne manca uno si butta via tutto e si aspetta il prossimo.
   Chi invece pubblica il fotogramma intero (JPEG, PNG, base64 o data
   URI, un messaggio = una foto) funziona lo stesso: si riconosce dai
   primi byte.                                                         */
const arena = $("#arena"), camEl = $("#cam"),
      nosigMsg = $("#nosigMsg"), nosigSub = $("#nosigTopic"),
      btnFit = $("#btnFit"), btnFull = $("#btnFull");
const VSTALE = Math.max(250, +VD.staleMs || 2000);
const VHEAD = Math.max(0, VD.chunkHeader === undefined ? 4 : +VD.chunkHeader || 0);
const VID = { first: false, last: 0, frames: [], bytes: [], urls: [], bad: 0, lost: 0, w: 0, h: 0 };
const CH = { id: -1, total: 0, got: 0, parts: null, done: false };

const MAGIC = [
  [[0xFF, 0xD8], "image/jpeg"],
  [[0x89, 0x50, 0x4E, 0x47], "image/png"],
  [[0x47, 0x49, 0x46], "image/gif"],
  [[0x52, 0x49, 0x46, 0x46], "image/webp"]     // RIFF….WEBP
];
const vidDec = (typeof TextDecoder !== "undefined") ? new TextDecoder() : null;
function asText(b) {
  if (vidDec) { try { return vidDec.decode(b); } catch (e) {} }
  let s = "";
  for (let i = 0; i < b.length; i++) s += String.fromCharCode(b[i]);
  return s;
}
// fotogramma intero in un solo messaggio: lo riconosco dai primi byte
function magicSrc(b) {
  if (b.length < 16) return "";
  for (const [sig, mime] of MAGIC) {
    let ok = true;
    for (let i = 0; i < sig.length; i++) if (b[i] !== sig[i]) { ok = false; break; }
    if (ok) return URL.createObjectURL(new Blob([b], { type: mime }));
  }
  return "";
}
// …e chi lo pubblica come testo: data URI o base64 nudo
function textSrc(b) {
  if (b.length < 16 || b[0] < 32 || b[0] > 126) return "";   // non è nemmeno ASCII stampabile
  const s = asText(b).trim();
  if (/^data:image\//i.test(s)) return s;
  const t = s.replace(/\s+/g, "");
  if (t.length > 64 && /^[A-Za-z0-9+/=]+$/.test(t)) return "data:image/jpeg;base64," + t;
  return "";
}

function showFrame(src, now) {
  if (src.charCodeAt(0) === 98 /* blob: */) {
    VID.urls.push(src);
    // ne tengo in vita qualcuno: il più vecchio è già stato disegnato da un pezzo
    while (VID.urls.length > 4) URL.revokeObjectURL(VID.urls.shift());
  }
  camEl.src = src;
  VID.last = now;
  VID.frames.push(now);
  if (!VID.first) { VID.first = true; arena.classList.add("live"); }
}

function startChunk(b, now) {
  if (CH.parts && !CH.done) VID.lost++;      // il fotogramma di prima è rimasto a metà
  CH.id = b[0]; CH.total = b[1]; CH.got = 0; CH.done = false;
  CH.parts = new Array(CH.total);
  addChunk(b, 0, now);
}
function addChunk(b, idx, now) {
  if (CH.done || !CH.parts || CH.parts[idx]) return;      // doppione, o foto già mostrata
  CH.parts[idx] = new Uint8Array(b.subarray(VHEAD));      // copia: il buffer di mqtt.js non è mio
  if (++CH.got < CH.total) return;
  CH.done = true;
  showFrame(URL.createObjectURL(new Blob(CH.parts, { type: "image/jpeg" })), now);
  CH.parts = null;
}

function onFrame(buf) {
  if (!buf || !buf.length) return;
  const now = performance.now();
  VID.bytes.push([now, buf.length]);         // il traffico si conta comunque, pezzi compresi

  const src = magicSrc(buf);                 // 1. un messaggio, una foto intera
  if (src) { showFrame(src, now); return; }

  if (VHEAD && buf.length > VHEAD + 1) {     // 2. un pezzo di foto, con l'etichetta davanti
    const total = buf[1], idx = buf[2];
    if (total && idx < total) {
      // il primo pezzo si riconosce perché comincia con l'inizio di un JPEG
      if (idx === 0 && buf[VHEAD] === 0xFF && buf[VHEAD + 1] === 0xD8) { startChunk(buf, now); return; }
      if (buf[0] === CH.id && total === CH.total) { addChunk(buf, idx, now); return; }
      // pezzo di una foto cominciata prima che arrivassi: zitto, aspetto la prossima.
      // Se però non ho mai visto un primo pezzo valido, qui c'è dell'altro e va detto.
      if (CH.id >= 0) return;
    }
  }

  const txt = textSrc(buf);                  // 3. foto intera scritta in base64
  if (txt) { showFrame(txt, now); return; }

  // formato sconosciuto: arriverebbe 20 volte al secondo, lo dico col contagocce
  if (VID.bad++ % 200 === 0)
    log("err", "video: messaggio non riconosciuto (" + buf.length + " byte) — attesi pezzi con etichetta, JPEG o base64");
}

// al primo fotogramma la scena prende le proporzioni della camera
camEl.addEventListener("load", () => {
  const w = camEl.naturalWidth, h = camEl.naturalHeight;
  if (w < 8 || h < 8 || (w === VID.w && h === VID.h)) return;   // il segnaposto trasparente non conta
  VID.w = w; VID.h = h;
  arena.style.setProperty("--ar", w + "/" + h);
  log("sys", "video: " + w + "×" + h);
});

function videoIdle(hard) {
  VID.last = 0;
  VID.frames.length = 0;
  VID.bytes.length = 0;
  CH.id = -1; CH.total = 0; CH.parts = null; CH.done = false;   // pezzi a metà: si ricomincia
  if (hard) { VID.first = false; VID.bad = 0; VID.lost = 0; arena.classList.remove("live"); }
}

function videoTick(now) {
  while (VID.frames.length && now - VID.frames[0] > 1000) VID.frames.shift();
  while (VID.bytes.length && now - VID.bytes[0][0] > 1000) VID.bytes.shift();
  let bytes = 0;
  for (let i = 0; i < VID.bytes.length; i++) bytes += VID.bytes[i][1];
  oFps.textContent = VID.frames.length || (VID.first ? "0" : "—");
  const kb = bytes / 1024;
  oKbps.textContent = bytes ? (kb >= 100 ? Math.round(kb) : kb.toFixed(1)) : "—";
  oLost.textContent = VID.lost;

  const stale = !VID.last || now - VID.last > VSTALE;
  arena.classList.toggle("stale", stale);
  if (!stale) return;
  const on = !F.vidOn || F.vidOn.checked;
  const msg = !on ? "video spento"
            : !connected ? "in attesa del broker"
            : VID.first ? "segnale perso" : "in attesa del video";
  const sub = !on ? "riattivalo dalla configurazione" : (videoTopic() || "(nessun topic)");
  if (nosigMsg.textContent !== msg) nosigMsg.textContent = msg;
  if (nosigSub.textContent !== sub) nosigSub.textContent = sub;
}

function applyVideo() {
  const cover = F.vidFit && F.vidFit.value === "cover";
  arena.classList.toggle("fill", !!cover);
  if (btnFit) btnFit.textContent = cover ? "RIEMPI" : "ADATTA";
  camEl.style.setProperty("--mx", VD.mirror ? "-1" : "1");
  camEl.style.setProperty("--my", VD.flip ? "-1" : "1");
}
if (btnFit) btnFit.onclick = () => {
  F.vidFit.value = F.vidFit.value === "cover" ? "contain" : "cover";
  F.vidFit.dispatchEvent(new Event("change"));   // stessa strada di un cambio dal form
};

/* ── schermo intero: nativo dove c'è, sennò a CSS ────── */
function fsElement() { return document.fullscreenElement || document.webkitFullscreenElement || null; }
function setImmersive(on) {
  document.body.classList.toggle("immersive", on);
  if (btnFull) {
    btnFull.textContent = on ? "✕" : "⛶";
    btnFull.setAttribute("aria-label", on ? "Esci dallo schermo intero" : "Schermo intero");
  }
  if (on) {
    const rq = arena.requestFullscreen || arena.webkitRequestFullscreen;
    if (rq) {
      try {
        Promise.resolve(rq.call(arena)).then(() => {
          // sul telefono ha senso solo in orizzontale, ma se il browser dice di no pazienza
          try { if (screen.orientation && screen.orientation.lock) screen.orientation.lock("landscape").catch(() => {}); }
          catch (e) {}
        }, () => {});
      } catch (e) {}
    }
  } else {
    try { if (screen.orientation && screen.orientation.unlock) screen.orientation.unlock(); } catch (e) {}
    const ex = document.exitFullscreen || document.webkitExitFullscreen;
    if (fsElement() && ex) { try { Promise.resolve(ex.call(document)).catch(() => {}); } catch (e) {} }
  }
}
if (btnFull) btnFull.onclick = () => setImmersive(!document.body.classList.contains("immersive"));
for (const ev of ["fullscreenchange", "webkitfullscreenchange"]) {
  document.addEventListener(ev, () => {
    if (!fsElement() && document.body.classList.contains("immersive")) setImmersive(false);
  });
}

/* ── STOP ────────────────────────────────────────────── */
function zeroAll() {
  steerHeld.clear();
  setSteer(centerVal());
}
function panic() {
  zeroAll();
  setLever(centerLV());                    // sterzo dritto, leva al centro (fermo)
  const T = topics();
  const p = movePayload("stop");
  if (T.move && pub(T.move, p.payload, F.retain.checked)) lastKey = p.key;
  speedTick(true);                        // e la velocità a zero viene pubblicata subito
}
$("#stop").addEventListener("pointerdown", ev => { ev.preventDefault(); panic(); });

addEventListener("blur", zeroAll);
document.addEventListener("visibilitychange", () => { if (document.hidden) zeroAll(); });
addEventListener("pagehide", () => { if (client && connected) { try { client.end(true); } catch (e) {} } });

/* ── valori + payload (tutti interi) ─────────────────── */
function moveVals(src, t) {
  const angle = steerVal, c = centerVal();
  const mag = leverMag(), dir = leverDir();
  return {
    angle: angle, anglei: angle, a: angle,
    heading: angle < c ? "left" : angle > c ? "right" : "straight",
    speed: mag, speedi: mag, dir: dir,   // modulo + verso (dal segno della leva)
    src: src, t: t
  };
}
function fillTpl(tpl, vals) {
  return String(tpl).replace(/\{(\w+)\}/g, (s, k) => (k in vals ? vals[k] : s));
}

function movePayload(src) {
  const v = moveVals(src, Date.now());
  const withType = F.addType.checked;
  switch (F.fmt.value) {
    case "csv":
    case "tank": {
      const key = String(v.angle);
      return { payload: key, key: key };
    }
    case "dir":
      return { payload: v.heading, key: v.heading };
    case "raw":
      return { payload: F.rawMove.value, key: "raw:" + F.rawMove.value };
    case "custom": {
      const tpl = F.tplMove.value;
      const noT = Object.assign({}, v, { t: 0 });   // chiave = payload senza timestamp
      return { payload: fillTpl(tpl, v), key: fillTpl(tpl, noT) };
    }
    default: {
      const o = withType ? { type: "move", angle: v.angle, t: v.t } : { angle: v.angle, t: v.t };
      return { payload: JSON.stringify(o), key: String(v.angle) };
    }
  }
}

function speedPayload() {
  const t = Date.now();
  const vals = moveVals("speed", t);
  switch (F.fmt.value) {
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
  const p = movePayload(steerSrc);
  const now = performance.now();
  const hb = +F.hb.value || 0;
  const send = !F.onchange.checked || p.key !== lastKey || (hb > 0 && now - lastPubAt >= hb);
  if (!send) return;
  // il log si limita da solo, ma il ritorno "dritto" si vede sempre
  const centered = steerVal === centerVal();
  const stopping = centered && !wasNeutral;
  const quiet = now - lastTxLog < 200 && !stopping;
  if (pub(T.move, p.payload, F.retain.checked, quiet)) {
    lastKey = p.key;
    lastPubAt = now;
    wasNeutral = centered;
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
  const key = String(leverVal);           // il verso è già nel segno di leverVal
  const now = performance.now();
  const hb = +F.hb.value || 0;
  // la leva è un valore impostato, non un flusso: niente raffica anche in modalità continua
  if (!force && key === lastSpeedKey && !(hb > 0 && now - lastSpeedAt >= hb)) return;
  if (pub(T.speed, payload, F.retain.checked)) { lastSpeedKey = key; lastSpeedAt = now; }
}

/* ── render ──────────────────────────────────────────── */
const oA = $("#oA"), oSrc = $("#oSrc"),
      oRate = $("#oRate"), oSent = $("#oSent"), oRtt = $("#oRtt"), oSpeed = $("#oSpeed"),
      oFps = $("#oFps"), oKbps = $("#oKbps"), oLost = $("#oLost");

let lastFrame = performance.now();
function render() {
  const now = performance.now();
  const dt = Math.min(0.1, (now - lastFrame) / 1000);
  lastFrame = now;

  gpTick();
  steerFrame(dt);

  steerEl.classList.toggle("live", steerId !== null || steerSrc === "gamepad" || steerSrc === "tastiera");
  oA.textContent = steerVal + "°";
  oSrc.textContent = steerSrc;

  while (stats.window.length && now - stats.window[0] > 1000) stats.window.shift();
  oRate.textContent = stats.window.length;
  oSent.textContent = stats.sent;
  oRtt.textContent = stats.rtt === null ? "—" : stats.rtt + " ms";
  videoTick(now);

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
function subOne(list, qos, what) {
  client.subscribe(list, { qos: qos }, err => {
    if (err) log("err", "subscribe: " + err.message);
    else {
      subscribed = [...new Set(subscribed.concat(list))];
      log("sys", "sottoscritto a " + list.join(", ") + " (" + what + ")");
    }
  });
}
function subscribeAll() {
  if (!client || !connected) return;
  const T = topics();
  if (T.echo.length) subOne(T.echo, +F.qos.value, "eco");
  if (T.vid.length) subOne(T.vid, 0, "video");        // il video sempre a QoS 0
}
function resubscribe() {
  if (!client || !connected) return;
  if (subscribed.length) { try { client.unsubscribe(subscribed); } catch (e) {} }
  subscribed = [];
  const T = topics();
  if (!T.echo.length && !T.vid.length) { log("sys", "sottoscrizioni rimosse"); return; }
  subscribeAll();
}
function syncFmtUI() {
  const f = F.fmt.value;
  $("#fTplMove").hidden = $("#fTplSpeed").hidden = f !== "custom";
  $("#fRawMove").hidden = $("#fRawSpeed").hidden = f !== "raw";
  F.addType.closest(".f").hidden = f !== "json";   // il campo type vale solo per i JSON
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
    if (["fmt","addType","tplMove","rawMove","tMove","retain"].includes(k)) lastKey = null;
    if (["fmt","addType","tplSpeed","rawSpeed","tSpeed"].includes(k)) lastSpeedKey = null;
    if (k === "fmt") syncFmtUI();
    if (k === "vidFit") applyVideo();
    if (k === "tVideo" || k === "vidOn") videoIdle(true);
    if (["sub", "tMove", "tSpeed", "tVideo", "vidOn"].includes(k)) resubscribe();
    if (NEEDS_RECONNECT.includes(k) && client) log("sys", "modifica applicata alla prossima connessione");
  };
  F[k].addEventListener("change", handler);
  if (F[k].type === "text" || F[k].type === "password" || F[k].type === "number") {
    F[k].addEventListener("input", () => { refreshHint(); if (URL_FIELDS.includes(k)) refreshUrl(); });
  }
}

// legende dei tasti, ricavate dalla configurazione
$("#steerLbl").textContent = ST.label || "angolo";
$("#steerKeys").textContent = [
  STKEYS.left[0] && keyLabel(STKEYS.left[0]) + " sx",
  STKEYS.right[0] && keyLabel(STKEYS.right[0]) + " dx",
  STKEYS.center[0] && keyLabel(STKEYS.center[0]) + " dritto"
].filter(Boolean).join(" · ");
$("#leverLbl").textContent = LV.label || "velocità";
$("#leverKeys").textContent = [
  LVKEYS.up[0] && keyLabel(LVKEYS.up[0]) + " su",
  LVKEYS.down[0] && keyLabel(LVKEYS.down[0]) + " giù",
  LVKEYS.zero[0] && keyLabel(LVKEYS.zero[0]) + " fermo"
].filter(Boolean).join(" · ");

refreshHint();
refreshUrl();
syncFmtUI();
applyVideo();
renderSteer();
renderLever();
if (!F.pubTopic.value) F.pubTopic.value = topics().speed || topics().move;

// segnala le sovrapposizioni in config.js invece di ignorarle in silenzio
function checkConfig() {
  for (const code of LEVERKEYS) {
    if (STEERKEYS.includes(code)) log("err", "config.js: " + code + " serve sia allo sterzo sia alla leva velocità: vince lo sterzo");
    else if (STOPKEYS.includes(code)) log("err", "config.js: " + code + " è sia STOP sia un tasto della leva: vince STOP");
  }
  for (const code of STOPKEYS) {
    if (STEERKEYS.includes(code)) log("err", "config.js: " + code + " è sia STOP sia un tasto dello sterzo: vince STOP");
  }
  if (!(ST.max > ST.min)) log("err", "config.js: la scala dello sterzo non è valida (max deve superare min)");
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
