window.JOYSTICK_CONFIG = {

  /* ── LEVETTA ORIZZONTALE — ANGOLO ────────────────────────────────────────
     La leva a sinistra, al posto del vecchio joystick. Manda solo l'angolo
     come numero intero sul topic del movimento.

       topic        dove pubblicare l'angolo (vuoto = topic movimento)
       label        scritta sotto la leva
       unit         unità mostrata accanto al numero (° per i gradi)
       min, max     estremi della scala: il valore pubblicato in {angle}
                    è questo numero intero (es. -90 tutto a sinistra,
                    +90 tutto a destra)
       center       posizione "dritto" (di solito 0)
       start        valore all'apertura (non viene ricordato: si riparte da qui)
       step         scatto di tastiera e rotellina del mouse
       spring       true = torna dritto (center) appena la lasci
       rate         gradi al secondo tenendo premuto un tasto di sterzata
       keys         tasti: sinistra, destra, dritto
       gamepadAxis  asse orizzontale che sterza (0 = stick sinistro), assoluto
       gamepadDeadzone  soglia sotto cui l'asse del gamepad viene ignorato    */
  steer: {
    topic: "",
    label: "angolo",
    unit: "°",
    min: 5,
    max: 175,
    center: 90,
    start: 90,
    step: 5,
    spring: true,
    rate: 180,
    keys: { left: ["KeyA", "ArrowLeft"], right: ["KeyD", "ArrowRight"], center: ["KeyS", "ArrowDown"] },
    gamepadAxis: 0,
    gamepadDeadzone: 0.12
  },

  /* ── LEVETTA VERTICALE — VELOCITÀ (bipolare) ─────────────────────────────
     La leva a destra, centrata sullo zero: sopra = avanti (azzurra),
     sotto = retromarcia (rossa). Niente bottoncino: il verso lo dà il segno
     della leva. Manda solo interi.

       topic        dove viene pubblicata la posizione della leva
       label, unit  come sopra
       min, max     estremi: giù (retromarcia piena) e su (avanti piena)
       center       posizione di riposo/fermo (di solito 0)
       start        valore all'apertura (non viene ricordato)
       step         scatto di tastiera e rotellina del mouse
       spring       true = torna al centro (fermo) appena la lasci
       keys         tasti: su, giù, azzera (torna al centro)
       gamepadAxis  asse che muove la leva (3 = verticale stick destro)
       gamepadUp/Down  tasti del gamepad che alzano/abbassano la leva (7=R2 6=L2)
       gamepadRate  quanto si muove la leva col gamepad, per secondo

     Nel payload: {speed} è il MODULO (sempre ≥ 0), {dir} il verso
     (1 = avanti quando la leva è ≥ centro, 0 = retromarcia sotto).         */
  lever: {
    topic: "esp32_car_fralor/speed",
    label: "velocità",
    unit: "",
    min: -220,                  // giù = retromarcia piena
    max: 220,                   // su = avanti piena
    center: 0,                  // riposo/fermo
    start: 0,
    step: 5,
    spring: false,
    keys: { up: ["KeyR"], down: ["KeyF"], zero: ["KeyZ"] },
    gamepadAxis: 3,
    gamepadUp: 7,
    gamepadDown: 6,
    gamepadRate: 80
  },

  /* ── STOP ────────────────────────────────────────────────────────────────
     Rimette dritto lo sterzo, azzera la velocità e pubblica lo zero.        */
  stopKeys: ["Space"],

  /* ── VALORI INIZIALI ─────────────────────────────────────────────────────
     Servono a far partire la pagina già configurata sul tuo broker.        */
  defaults: {
    // broker — attenzione: dal browser MQTT viaggia su WebSocket.
    // La 1883 (e la 8883) sono le porte TCP, quelle che usa l'ESP32:
    // dal browser servono 8884 con TLS (obbligatoria da https) oppure
    // 8000 senza TLS aprendo la pagina in locale via http.
    host: "broker.hivemq.com",
    port: 8884,
    path: "/mqtt",
    tls: true,                  // true = wss://  ·  false = ws://
    username: "",
    password: "",
    protocol: 4,                // 4 = MQTT 3.1.1 · 5 = MQTT 5.0 · 3 = MQTT 3.1
    keepalive: 30,
    reconnectMs: 2500,
    cleanSession: true,

    // topic
    topicMove: "esp32_car_fralor/move",
    qos: 0,
    retain: false,
    subscribe: true,            // riascolta i propri topic: eco nel log e misura dell'RTT

    // payload: "json" | "csv" | "dir" | "custom" | "raw" — sempre interi
    format: "json",
    addType: false,
    templateMove: '{"angle":{angle}}',
    templateSpeed: '{"speed":{speed}, "dir": {dir}}',
    rawMove: "1",
    rawSpeed: "1",

    // comportamento
    rateHz: 20,
    heartbeatMs: 1000,          // 0 = nessun heartbeat
    onlyOnChange: true
  }
};
