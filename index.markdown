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
    <span class="star-text">Ti piace il sito?</span>
    <br>
    <span class="star-text">Lascia una stella su GitHub!</span>
    <br>
    <a href="https://github.com/Chris1sFlaggin/Chris1sFlaggin.github.io" target="_blank" class="star-button">
      ⭐ Stella
    </a>
    <button id="close-star-alert" class="close-button">&times;</button>
  </div>
</div>

<div class="fullscreen-dashboard">
  
  <div class="profile-side">
    <div class="profile-content">
      
      <div class="logo-container">
        <div class="rays"></div>
        <img src="/images/chris.jpg" alt="Profile" class="animated-logo">
        <div class="pulse-ring"></div>
      </div>

      <div class="description-box">
        <p class="desc-text">
          {{ site.description | default: "I'm a IT student with a deep passion for cybersecurity. I'm still learning so pls be patient with me🙏. Here I'll post my CTF write ups and my own projects.📖 Hope you enjoy your stay!👋" }}
        </p>
      </div>

    </div>
  </div>

  <div class="content-side">
    
    <div class="section-block">
      <h2 class="section-title">I MIEI PROFILI</h2>
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
      <h2 class="section-title">CATEGORIES</h2>
      <div class="categories-grid">
        {% for category in site.categories %}
          {% assign category_name = category | first %}
          <div class="card category-card" data-category="{{ category_name | slugify }}">
            <div class="card-bg"></div>
            <div class="card-content">
              <h3>{{ category_name }}</h3>
              <p>{{ site.categories[category_name].size }} posts</p>
              <a href="{{ site.baseurl }}/categories/{{ category_name | slugify }}/" class="btn-view">View Posts</a>
            </div>
          </div>
        {% endfor %}
      </div>
    </div>
    
    <div class="dashboard-footer">
      <small>© 2025 Chris1sFlaggin</small>
    </div>

  </div>
</div>

<style>
  /* --- 1. RESET TOTALE TEMA MINIMAL MISTAKES --- */
  /* Nascondiamo header e footer originali del tema per avere l'effetto Full Screen Dashboard */
  .masthead, .page__footer, .skip-link {
    display: none !important;
  }

  /* Rimuoviamo i limiti di larghezza imposti dal tema */
  #main, .page__inner-wrap, .page__content, .archive {
    width: 100% !important;
    max-width: 100% !important;
    padding: 0 !important;
    margin: 0 !important;
    border: none !important;
    background: #1a1e25 !important;
  }
  
  body {
    overflow-x: hidden;
    background-color: #1a1e25;
    margin: 0;
  }

  /* --- 2. LAYOUT DASHBOARD --- */
  .fullscreen-dashboard {
    display: flex;
    flex-direction: column; /* Mobile first: verticale */
    min-height: 100vh;
    width: 100vw;
    background: #1a1e25;
    font-family: sans-serif;
  }

  /* Desktop Layout (> 1024px) */
  @media (min-width: 1024px) {
    .fullscreen-dashboard {
      flex-direction: row; /* Desktop: orizzontale */
      height: 100vh; /* Blocca l'altezza allo schermo */
      overflow: hidden;
    }

    .profile-side {
      width: 35%; /* Colonna sinistra leggermente più stretta */
      height: 100%;
      overflow-y: auto;
      border-right: 1px solid rgba(100, 255, 218, 0.1);
      box-shadow: 5px 0 15px rgba(0,0,0,0.2);
      z-index: 10;
    }

    .content-side {
      width: 65%;
      height: 100%;
      overflow-y: auto;
      padding: 4rem 3rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
  }

  /* --- 3. STILI COLONNA SINISTRA (PROFILO) --- */
  .profile-side {
    background: linear-gradient(135deg, #16191f 0%, #1a1e25 100%);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 3rem 1rem;
    position: relative;
  }

  .profile-content {
    text-align: center;
    max-width: 400px;
  }

  /* Animazione Immagine */
  .logo-container {
    width: 200px; height: 200px;
    margin: 0 auto 2rem;
    position: relative;
  }
  
  @media (min-width: 1024px) {
    .logo-container { width: 260px; height: 260px; }
  }

  .animated-logo {
    width: 100%; height: 100%;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid #64ffda;
    position: relative; z-index: 2;
    box-shadow: 0 0 25px rgba(100, 255, 218, 0.3);
  }

  .pulse-ring {
    position: absolute; top: -10%; left: -10%; width: 120%; height: 120%;
    border-radius: 50%; border: 2px solid #64ffda;
    animation: pulse 3s infinite; opacity: 0;
  }
  
  @keyframes pulse { 0% { transform: scale(0.9); opacity: 1; } 100% { transform: scale(1.4); opacity: 0; } }

  .desc-title {
    color: #fff; font-size: 2rem; margin-bottom: 1rem;
    text-transform: uppercase; letter-spacing: 2px;
  }
  
  .desc-text {
    color: #b0b3b8; font-size: 1rem; line-height: 1.6;
  }

  /* --- 4. STILI COLONNA DESTRA (CONTENUTI) --- */
  .content-side {
    padding: 2rem 1rem;
  }

  .section-block { margin-bottom: 3rem; }
  
  .section-title {
    color: #64ffda;
    font-size: 1.2rem;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    margin-bottom: 1.5rem;
    border-bottom: 1px solid rgba(100, 255, 218, 0.2);
    padding-bottom: 0.5rem;
    display: inline-block;
  }

  /* Cards Generiche */
  .card {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    transition: all 0.3s ease;
    text-decoration: none;
    overflow: hidden;
  }
  
  .card:hover {
    transform: translateY(-5px);
    border-color: #64ffda;
    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
  }

  /* Social Grid Fix */
  .social-grid {
    display: grid;
    /* Grid responsive: minimo 140px, altrimenti riempie */
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); 
    gap: 1.5rem;
  }

  .social-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1.5rem;
  }

  .icon-box {
    width: 40px; height: 40px; margin-bottom: 1rem;
  }
  
  .icon-box img { width: 100%; height: 100%; object-fit: contain; }
  .card-label { color: #fff; font-weight: 600; }

  /* Categories Grid */
  .categories-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
  }

  .category-card {
    position: relative; height: 200px;
  }
  
  .card-bg {
    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
    background-size: cover; background-position: center;
    transition: transform 0.3s;
  }
  
  .category-card[data-category="writeups"] .card-bg { background-image: url('/images/writeups.jpg'); }
  .category-card[data-category="projects"] .card-bg { background-image: url('/images/projects.jpg'); }

  .category-card:hover .card-bg { transform: scale(1.05); }

  .card-content {
    position: relative; z-index: 2; width: 100%; height: 100%;
    background: rgba(26, 30, 37, 0.85); /* Overlay scuro */
    display: flex; flex-direction: column;
    justify-content: center; align-items: center;
    transition: background 0.3s;
  }
  
  .category-card:hover .card-content { background: rgba(26, 30, 37, 0.6); }

  .card-content h3 { color: #64ffda; font-size: 1.8rem; margin: 0; font-weight: 700; }
  .card-content p { color: #ccc; margin: 0.5rem 0 1rem; }

  .btn-view {
    background: #64ffda; color: #1a1e25;
    padding: 0.5rem 1.5rem; border-radius: 20px;
    font-weight: bold; text-decoration: none;
    font-size: 0.9rem;
  }
  .btn-view:hover { background: #fff; }

  .dashboard-footer {
    margin-top: 3rem;
    text-align: center;
    color: #555;
    font-size: 0.8rem;
  }

  /* Star Alert (Legacy) */
  .star-alert { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 9999; display: none; align-items: center; justify-content: center; }
  .star-alert-content { background: #1a1e25; border: 2px solid #64ffda; padding: 2rem; border-radius: 16px; text-align: center; color: #fff; }
  .close-button { position: absolute; top: 10px; right: 10px; background: none; border: none; color: #fff; font-size: 1.5rem; cursor: pointer; }
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