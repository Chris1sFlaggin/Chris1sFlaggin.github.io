---
layout: splash
title: "Home"
header:
  overlay_filter: rgba(0, 0, 0, 0)
---

<script async src="https://www.googletagmanager.com/gtag/js?id=G-BL2501MC35"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-BL2501MC35');
</script>

<div id="star-alert" class="star-alert">
  <div class="star-alert-content">
    <span class="star-icon">⭐</span>
    <span class="star-text">Ti piace il sito?</span><br>
    <span class="star-text">Lascia una stella su GitHub!</span><br>
    <a href="https://github.com/Chris1sFlaggin/Chris1sFlaggin.github.io" target="_blank" class="star-button">⭐ Stella</a>
    <button id="close-star-alert" class="close-button">&times;</button>
  </div>
</div>

<style>
  .star-alert { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 9999; display: none; align-items: center; justify-content: center; }
  .star-alert-content { background: #1a1e25; border: 2px solid #64ffda; padding: 2rem; border-radius: 16px; text-align: center; color: #fff; }
  .close-button { position: absolute; top: 10px; right: 10px; background: none; border: none; color: #fff; font-size: 1.5rem; cursor: pointer; }
  .star-button { display: inline-block; margin-top: 10px; padding: 10px 20px; background: #252a34; color: #64ffda; border-radius: 8px; text-decoration: none; border: 1px solid #64ffda; }
  .hidden { display: none !important; }
</style>

<script>
(function() {
  const STORAGE_KEY = 'star-alert-dismissed';
  const SHOW_DELAY = 3000;
  function showStarAlert() {
    if (localStorage.getItem(STORAGE_KEY) === 'true') return;
    const alert = document.getElementById('star-alert');
    const closeButton = document.getElementById('close-star-alert');
    if (!alert || !closeButton) return;
    setTimeout(() => { alert.style.display = 'flex'; }, SHOW_DELAY);
    closeButton.addEventListener('click', function() {
      alert.classList.add('hidden');
      localStorage.setItem(STORAGE_KEY, 'true');
    });
  }
  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', showStarAlert); }
  else { showStarAlert(); }
})();
</script>

<div class="fullscreen-dashboard">
  
  <div class="profile-side">
    <div class="profile-content">
      <div class="logo-container">
        <div class="rays"></div>
        <img src="/images/chris.jpg" alt="Profile" class="animated-logo">
        <div class="pulse-ring"></div>
      </div>
      <div class="description-box">
        <h1 class="desc-title">chris1sflaggin</h1>
        <p class="desc-text">
          {{ site.description | default: "I'm a IT student with a deep passion for cybersecurity. Here I'll post my CTF write ups and my own projects. Hope you enjoy your stay! 👋" }}
        </p>
      </div>
    </div>
  </div>

  <div class="content-side">
    
    <div class="section-block">
      <h2 class="section-title">SOCIALS</h2>
      <div class="social-grid">
        {% for account in site.data.social_accounts %}
          <a class="card social-card" href="{{ account.url }}" target="_blank" rel="noopener noreferrer">
            <div class="icon-box">
              {% if account.logo %}
                <img src="{{ account.logo }}" alt="{{ account.name }}">
              {% else %}
                <span>{{ account.name | slice: 0,1 }}</span>
              {% endif %}
            </div>
            <span class="card-label">{{ account.name }}</span>
          </a>
        {% endfor %}
      </div>
    </div>

    <div class="section-block">
      <h2 class="section-title">CONTENTS</h2>
      <div class="categories-grid">
        {% assign sorted_categories = site.categories | sort %}
        
        {% for category in sorted_categories %}
          {% assign category_name = category | first %}
          
          {% unless category_name == 'stack' or category_name == 'heap' %}
          
            <div class="card category-card" data-category="{{ category_name | slugify }}">
              <div class="card-bg"></div>
              <div class="card-content">
                <h3>{{ category_name | capitalize }}</h3>
                <p>{{ category | last | size }} posts</p>
                <a href="{{ site.baseurl }}/categories/{{ category_name | slugify }}/" class="btn-view">Access Data</a>
              </div>
            </div>

          {% endunless %}
        {% endfor %}
      </div>
    </div>
    
    <div class="dashboard-footer">
      <small>© 2025 Chris1sFlaggin | System Online</small>
    </div>

  </div>
</div>

<style>
  /* --- CRITICAL CSS RESET --- */
  /* This fixes the "crooked" layout by forcing full width */
  body {
    background-color: #1a1e25;
    margin: 0;
    padding: 0;
    overflow-x: hidden;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  }
  
  /* Hide Theme Elements */
  .masthead, .page__footer, .skip-link, .greedy-nav { 
    display: none !important; 
  }
  
  /* Reset Theme Containers */
  #main, .page__inner-wrap, .page__content, .archive {
    width: 100% !important;
    max-width: 100% !important;
    padding: 0 !important;
    margin: 0 !important;
    background: #1a1e25 !important;
    border: none !important;
    box-shadow: none !important;
  }

  /* --- DASHBOARD STYLES --- */
  .fullscreen-dashboard {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    width: 100%;
  }

  /* Profile Side */
  .profile-side {
    background: linear-gradient(180deg, #15181e 0%, #1a1e25 100%);
    padding: 2rem;
    display: flex;
    justify-content: center;
    width: 100%;
    box-sizing: border-box;
    border-bottom: 1px solid rgba(100, 255, 218, 0.1);
  }

  .logo-container { width: 140px; height: 140px; margin: 0 auto 1.5rem; position: relative; }
  .animated-logo { width: 100%; height: 100%; border-radius: 50%; border: 3px solid #64ffda; position: relative; z-index: 2; box-shadow: 0 0 20px rgba(100, 255, 218, 0.2); }
  .pulse-ring { position: absolute; top: -10%; left: -10%; width: 120%; height: 120%; border: 2px solid #64ffda; border-radius: 50%; animation: pulse 3s infinite; opacity: 0; }
  @keyframes pulse { 0% { transform: scale(0.9); opacity: 1; } 100% { transform: scale(1.4); opacity: 0; } }

  .desc-title { display: none; } /* Hidden on mobile */
  .desc-text { color: #b0b3b8; font-size: 0.95rem; line-height: 1.5; text-align: center; }

  /* Content Side */
  .content-side {
    padding: 2rem 1.5rem;
    width: 100%;
    box-sizing: border-box;
  }

  .section-title {
    color: #64ffda;
    font-size: 1.1rem;
    font-weight: 700;
    text-transform: uppercase;
    border-bottom: 1px solid rgba(100, 255, 218, 0.2);
    padding-bottom: 0.5rem;
    margin-bottom: 1rem;
  }
  
  /* Grids */
  .social-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(110px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
  .card { background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 12px; text-decoration: none; transition: transform 0.2s; }
  .social-card { display: flex; flex-direction: column; align-items: center; padding: 1.2rem; }
  .icon-box img { width: 32px; height: 32px; object-fit: contain; }
  .card-label { color: #fff; font-size: 0.9rem; margin-top: 0.5rem; }

  .categories-grid { display: grid; grid-template-columns: 1fr; gap: 1.5rem; }
  .category-card { position: relative; height: 180px; overflow: hidden; border-radius: 12px; }
  .card-bg { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-size: cover; background-position: center; transition: transform 0.5s; background-color: #222; }
  
  /* Category Images */
  .category-card[data-category="writeups"] .card-bg { background-image: url('/images/writeups.jpg'); }
  .category-card[data-category="projects"] .card-bg { background-image: url('/images/projects.jpg'); }
  .category-card[data-category="university"] .card-bg { background-image: url('/images/pwncollege.svg'); background-size: contain; background-repeat: no-repeat; background-color: #111; }

  .card-content { position: relative; z-index: 2; width: 100%; height: 100%; background: rgba(26, 30, 37, 0.7); display: flex; flex-direction: column; justify-content: center; align-items: center; }
  .card-content h3 { color: #64ffda; font-size: 1.5rem; margin: 0; text-transform: uppercase; }
  .card-content p { color: #ccc; font-size: 0.9rem; margin: 5px 0 15px; }
  .btn-view { background: transparent; color: #64ffda; padding: 5px 15px; border: 1px solid #64ffda; border-radius: 4px; text-decoration: none; font-size: 0.85rem; transition: all 0.2s; }
  .btn-view:hover { background: #64ffda; color: #1a1e25; }

  .dashboard-footer { text-align: center; color: #555; margin-top: 2rem; font-size: 0.8rem; }

  /* Desktop View */
  @media (min-width: 1024px) {
    .fullscreen-dashboard { flex-direction: row; height: 100vh; overflow: hidden; }
    
    .profile-side {
      width: 35%;
      height: 100%;
      overflow-y: auto;
      border-right: 1px solid rgba(100,255,218,0.1);
      border-bottom: none;
      padding: 3rem 1rem;
    }
    
    .content-side {
      width: 65%;
      height: 100%;
      overflow-y: auto;
      padding: 4rem 3rem;
    }
    
    .logo-container { width: 260px; height: 260px; }
    .desc-title { display: block; color: #fff; font-size: 2rem; margin-bottom: 1rem; text-transform: uppercase; text-align: center; }
    
    .categories-grid { grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); }
    .category-card { height: 220px; }
    
    .category-card:hover .card-bg { transform: scale(1.05); }
    .card:hover { transform: translateY(-5px); border-color: #64ffda; }
  }
</style>