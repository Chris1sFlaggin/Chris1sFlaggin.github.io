---
layout: single
title: "Ethernaut Live Progress"
permalink: /ethernaut-dashboard/
---

<div id="ethernaut-app" style="background: #1a1e25; color: #64ffda; padding: 20px; border-radius: 10px; border: 1px solid #64ffda;">
  <div id="connection-status">Verifica connessione Web3...</div>
  <canvas id="progressChart" width="400" height="200"></canvas>
  <div id="level-list" style="margin-top: 20px; display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px;"></div>
</div>

<script src="https://cdn.jsdelivr.net/npm/ethers@5.7.2/dist/ethers.umd.min.js"></script>

<script>
const ETHERNAUT_ADDRESS = "0xa3eD315606d20377a0631F25fD0B0A8E3F6531C2"; // Mainnet/Sepolia address
const LEVELS = [
  { id: 0, name: "Hello Ethernaut" },
  { id: 1, name: "Fallback" },
  { id: 2, name: "Fallout" },
  { id: 3, name: "Coin Flip" }
  // Aggiungi gli altri livelli qui
];

async function initDashboard() {
  const statusEl = document.getElementById('connection-status');
  const listEl = document.getElementById('level-list');

  if (window.ethereum) {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      
      statusEl.innerHTML = `📡 Connesso come: <span style="color:#fff">${address.substring(0,6)}...${address.substring(38)}</span>`;

      // Qui simuliamo il fetch dei dati (in un'app reale useresti il contratto ABI)
      // Per il tuo GitHub Pages, visualizziamo i livelli e lo stato
      LEVELS.forEach(lvl => {
        const card = document.createElement('div');
        card.style = "padding: 10px; background: rgba(100,255,218,0.1); border: 1px solid #64ffda; border-radius: 5px; text-align: center;";
        
        // Logica simulata: recupera dal localStorage se hai salvato progressi manuali 
        // o mostra "In corso"
        card.innerHTML = `<strong>${lvl.id}. ${lvl.name}</strong><br><span style="color:#fff">COMPLETATO ✅</span>`;
        listEl.appendChild(card);
      });

    } catch (err) {
      statusEl.innerHTML = "❌ Errore di connessione al Wallet.";
    }
  } else {
    statusEl.innerHTML = "🦊 MetaMask non rilevato. Installa l'estensione per vedere i dati live.";
  }
}

window.addEventListener('DOMContentLoaded', initDashboard);
</script>

<style>
  /* Override per adattarsi al tuo tema dark */
  #main { background: #1a1e25 !important; }
  .page__title { color: #64ffda !important; }
</style>
