---
layout: default
title: CTF Write Ups
permalink: /categories/writeups/
---

<div class="content-side" style="padding: 2rem 1.5rem; width: 100%; box-sizing: border-box;">
  <h2 class="section-title" style="color: #64ffda; text-transform: uppercase; border-bottom: 1px solid rgba(100, 255, 218, 0.2); padding-bottom: 0.5rem; margin-bottom: 2rem;">Seleziona Settore</h2>
  
  <div class="categories-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem;">
    
    <div class="card category-card" style="position: relative; height: 220px; overflow: hidden; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.05); background: rgba(255, 255, 255, 0.03);">
      <div class="card-content" style="position: relative; z-index: 2; width: 100%; height: 100%; background: rgba(26, 30, 37, 0.7); display: flex; flex-direction: column; justify-content: center; align-items: center;">
        <h3 style="color: #64ffda; font-size: 1.5rem; text-transform: uppercase; margin: 0;">Stack Exploitation</h3>
        <p style="color: #ccc; font-size: 0.9rem; margin: 5px 0 15px;">{{ site.categories.stack | size }} posts</p>
        <a href="{{ site.baseurl }}/categories/writeups/stack" class="btn-view" style="color: #64ffda; padding: 5px 15px; border: 1px solid #64ffda; border-radius: 4px; text-decoration: none; font-size: 0.85rem;">Access Data</a>
      </div>
    </div>

    <div class="card category-card" style="position: relative; height: 220px; overflow: hidden; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.05); background: rgba(255, 255, 255, 0.03);">
      <div class="card-content" style="position: relative; z-index: 2; width: 100%; height: 100%; background: rgba(26, 30, 37, 0.7); display: flex; flex-direction: column; justify-content: center; align-items: center;">
        <h3 style="color: #64ffda; font-size: 1.5rem; text-transform: uppercase; margin: 0;">Heap Exploitation</h3>
        <p style="color: #ccc; font-size: 0.9rem; margin: 5px 0 15px;">{{ site.categories.heap | size }} posts</p>
        <a href="{{ site.baseurl }}/categories/writeups/heap" class="btn-view" style="color: #64ffda; padding: 5px 15px; border: 1px solid #64ffda; border-radius: 4px; text-decoration: none; font-size: 0.85rem;">Access Data</a>
      </div>
    </div>

  </div>
</div>