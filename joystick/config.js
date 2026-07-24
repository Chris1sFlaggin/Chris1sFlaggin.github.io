/* ──────────────────────────────────────────────────────────────────────────
   Joystick MQTT — configurazione
   Questo è l'unico file da toccare per personalizzare comandi e valori
   iniziali. Niente build: salvi e ricarichi la pagina.

   Due comandi, due levette:
     · sinistra, orizzontale → l'ANGOLO di sterzata (intero) sul topic movimento
     · destra, verticale     → la VELOCITÀ (intero) + marcia sul topic velocità
   Tutti i numeri pubblicati sono interi.

   Nota: le impostazioni che cambi dall'interfaccia vengono ricordate nel
   browser e hanno la precedenza su "defaults". Il pulsante "Reset
   impostazioni" cancella la memoria e rimette i valori di questo file.
   ────────────────────────────────────────────────────────────────────────── */

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
    min: 0,
    max: 180,
    center: 90,
    start: 90,
    step: 5,
    spring: true,
    rate: 180,
    keys: { left: ["KeyA", "ArrowLeft"], right: ["KeyD", "ArrowRight"], center: ["KeyS", "ArrowDown"] },
    gamepadAxis: 0,
    gamepadDeadzone: 0.12
  },

  /* ── LEVETTA VERTICALE — VELOCITÀ ────────────────────────────────────────
     La leva a destra. Resta dove la lasci (come una manetta vera) e
     stabilisce quanto va veloce il mezzo. Manda solo interi.

       topic        dove viene pubblicata la posizione della leva
       label, unit  come sopra
       min, max     estremi della scala: {speed} è questo intero
       start        valore all'apertura (non viene ricordato)
       step         scatto di tastiera e rotellina del mouse
       spring       true = torna a "min" appena la lasci
       keys         tasti: su, giù, azzera
       gamepadAxis  asse che muove la leva (3 = verticale stick destro)
       gamepadUp/Down  tasti del gamepad che alzano/abbassano la leva (7=R2 6=L2)
       gamepadRate  quanto si muove la leva col gamepad, per secondo
       reverse      bottoncino avanti/retromarcia: pubblica {dir},
                    1 = avanti (predefinito), 0 = retromarcia                 */
  lever: {
    topic: "esp32_car_fralor/speed",
    label: "velocità",
    unit: "",
    min: 0,
    max: 220,
    start: 120,
    step: 5,
    spring: false,
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
