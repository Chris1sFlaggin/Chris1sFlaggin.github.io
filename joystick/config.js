/* ──────────────────────────────────────────────────────────────────────────
   Joystick MQTT — configurazione
   Questo è l'unico file da toccare per personalizzare comandi e valori
   iniziali. Niente build: salvi e ricarichi la pagina.

   Nota: le impostazioni che cambi dall'interfaccia vengono ricordate nel
   browser e hanno la precedenza su "defaults". Il pulsante "Reset
   impostazioni" cancella la memoria e rimette i valori di questo file.
   ────────────────────────────────────────────────────────────────────────── */

window.JOYSTICK_CONFIG = {

  /* ── LEVETTA DELLA VELOCITÀ ──────────────────────────────────────────────
     La leva verticale accanto allo stick. Resta dove la lasci (come una
     manetta vera) e stabilisce quanto va veloce il mezzo.

       topic        dove viene pubblicata la posizione della leva
       label        scritta sotto la leva
       unit         unità mostrata accanto al numero
       min, max     estremi della scala: il valore pubblicato in {speed}
                    è questo numero, non una percentuale
       start        valore all'apertura della pagina (non viene ricordato
                    fra una sessione e l'altra: si riparte sempre da qui)
       step         scatto di tastiera e rotellina del mouse
       spring       true = torna a "min" appena la lasci
       scalesStick  true = moltiplica l'uscita dello stick, cioè x e y
                    escono già ridotti in proporzione alla leva
       keys         tasti: su, giù, azzera
       gamepadAxis  asse che muove la leva (3 = verticale dello stick
                    destro), null per disattivarlo
       gamepadUp/Down  tasti del gamepad che alzano/abbassano la leva
                    (7 = R2, 6 = L2)
       gamepadRate  quanto si muove la leva col gamepad, per secondo
       reverse      il bottoncino avanti/retromarcia: pubblica {dir},
                    1 = avanti (predefinito), 0 = retromarcia            */
  lever: {
    topic: "esp32_car_fralor/speed",
    label: "velocità",
    unit: "",
    min: 0,
    max: 220,
    start: 120,
    step: 5,
    spring: false,
    scalesStick: true,
    keys: { up: ["KeyR"], down: ["KeyF"], zero: ["KeyZ"] },
    gamepadAxis: 3,
    gamepadUp: 7,
    gamepadDown: 6,
    gamepadRate: 80,
    reverse: {
      start: 1,                     // 1 = avanti · 0 = retromarcia
      keys: ["KeyX"],               // tasto che inverte
      gamepadButton: 1,             // tasto del gamepad che inverte (null = nessuno)
      forwardLabel: "avanti",
      reverseLabel: "retro"
    }
  },

  /* ── STICK ───────────────────────────────────────────────────────────────
     Tasti che muovono lo stick e mappatura del gamepad.                    */
  axis: {
    up:    ["KeyW", "ArrowUp"],
    down:  ["KeyS", "ArrowDown"],
    left:  ["KeyA", "ArrowLeft"],
    right: ["KeyD", "ArrowRight"],
    gamepadAxes: [0, 1],                              // stick sinistro: [asse X, asse Y]
    gamepadDpad: { up: 12, down: 13, left: 14, right: 15 },
    keyRamp: 0.28                                     // 1 = scatto secco, 0.1 = molto morbido
  },

  /* ── STOP ────────────────────────────────────────────────────────────────
     Azzera stick e leva e pubblica lo zero sul topic del movimento.        */
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

    // payload: "json" | "tank" | "csv" | "dir" | "custom" | "raw"
    format: "json",
    addType: false,
    templateMove: '{"x":{x},"y":{y},"v":{speedi}}',
    templateSpeed: '{"speed":{speed}, "dir": {dir}}',
    rawMove: "1",
    rawSpeed: "1",

    // comportamento
    rateHz: 20,
    deadzone: 8,                // percentuale
    heartbeatMs: 1000,          // 0 = nessun heartbeat
    onlyOnChange: true,
    invertY: false
  }
};
