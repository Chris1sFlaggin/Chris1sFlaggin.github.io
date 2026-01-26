---
layout: single
title: "Ethernaut Portfolio Dashboard"
permalink: /ethernaut-dashboard/
---

<div id="ethernaut-app" style="background: #1a1e25; color: #64ffda; padding: 20px; border-radius: 10px; border: 1px solid #64ffda; font-family: 'Courier New', Courier, monospace;">
  <div id="connection-status" style="margin-bottom: 20px; border-bottom: 1px solid #64ffda; padding-bottom: 10px;">
    Progressi attuali
  </div>
  
  <div id="level-list" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;"></div>
</div>

<script>
// I tuoi progressi reali (Hardcoded)
const MY_PROGRESS = {
  0: { name: "Hello Ethernaut", solved: true },
  1: { name: "Fallback", solved: true },
  2: { name: "Fallout", solved: true },
  3: { name: "Coin Flip", solved: true },
  4: { name: "Telephone", solved: true },
  5: { name: "Token", solved: true },
  6: { name: "Delegation", solved: false },
  7: { name: "Force", solved: false }
};

function renderDashboard() {
  const listEl = document.getElementById('level-list');
  listEl.innerHTML = '';

  Object.keys(MY_PROGRESS).forEach(id => {
    const lvl = MY_PROGRESS[id];
    const card = document.createElement('div');
    
    // Stile dinamico basato sullo stato
    const borderColor = lvl.solved ? "#64ffda" : "#444";
    const opacity = lvl.solved ? "1" : "0.5";
    const shadow = lvl.solved ? "0 0 10px rgba(100,255,218,0.3)" : "none";

    card.style = `padding: 15px; background: rgba(100,255,218,0.05); border: 1px solid ${borderColor}; border-radius: 5px; text-align: center; opacity: ${opacity}; box-shadow: ${shadow}; transition: 0.3s;`;
    
    card.innerHTML = `
      <div style="font-size: 0.8em; color: #888;">LEVEL ${id}</div>
      <div style="font-weight: bold; margin: 5px 0;">${lvl.name}</div>
      <div style="font-size: 1.2em;">${lvl.solved ? '✅' : '🏗️'}</div>
      <div style="font-size: 0.7em; margin-top: 5px;">${lvl.solved ? 'COMPLETED' : 'IN PROGRESS'}</div>
    `;
    listEl.appendChild(card);
  });
}

window.addEventListener('DOMContentLoaded', renderDashboard);
</script>