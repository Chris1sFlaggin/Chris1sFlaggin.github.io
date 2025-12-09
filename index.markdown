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
        <h1 class="desc-title">DESCRIZIONE</h1>
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
  /* --- 1. RESET TOTALE --- */
  .masthead, .page__footer, .skip-link { display: none !important; }
  #main, .page__inner-wrap, .page__content, .archive {
    width: 100% !important; max-width: 100% !important;
    padding: 0 !important; margin: 0 !important;
    border: none !important; background: #1a1e25 !important;
  }
  
  body {
    background-color: #1a1e25;
    margin: 0;
    overflow-x: hidden; /* Evita scroll orizzontale */
  }

  /* --- 2. LAYOUT DASHBOARD (MOBILE DEFAULT) --- */
  .fullscreen-dashboard {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    width: 100%;
    background: #1a1e25;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  }

  /* --- 3. PROFILO (MOBILE) --- */
  .profile-side {
    width: 100%;
    /* Sfondo leggermente diverso per staccare visivamente */
    background: linear-gradient(180deg, #15181e 0%, #1a1e25 100%);
    padding: 2rem 1rem 1rem; /* Padding ridotto */
    display: flex;
    justify-content: center;
    border-bottom: 1px solid rgba(100, 255, 218, 0.1);
    box-sizing: border-box;
  }

  .profile-content {
    text-align: center;
    width: 100%;
    max-width: 500px;
  }

  .logo-container {
    width: 140px; /* Più piccolo su mobile */
    height: 140px;
    margin: 0 auto 1.5rem;
    position: relative;
  }

  .animated-logo {
    width: 100%; height: 100%;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid #64ffda;
    position: relative; z-index: 2;
    box-shadow: 0 0 20px rgba(100, 255, 218, 0.2);
  }

  .rays, .pulse-ring {
    position: absolute; width: 100%; height: 100%; border-radius: 50%;
  }
  .pulse-ring {
    top: -10%; left: -10%; width: 120%; height: 120%;
    border: 2px solid #64ffda;
    animation: pulse 3s infinite; opacity: 0;
  }
  @keyframes pulse { 0% { transform: scale(0.9); opacity: 1; } 100% { transform: scale(1.4); opacity: 0; } }

  /* Titolo DESCRIZIONE nascosto su mobile */
  .desc-title {
    display: none; 
  }

  .desc-text {
    color: #b0b3b8;
    font-size: 0.95rem;
    line-height: 1.5;
    margin-bottom: 1rem;
    padding: 0 10px;
  }

  /* --- 4. CONTENUTI (MOBILE) --- */
  .content-side {
    width: 100%;
    padding: 2rem 1.5rem; /* Spazio laterale */
    box-sizing: border-box;
  }

  .section-block { margin-bottom: 2.5rem; }

  .section-title {
    color: #64ffda;
    font-size: 1.1rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    margin-bottom: 1rem;
    border-bottom: 1px solid rgba(100, 255, 218, 0.2);
    padding-bottom: 0.5rem;
    display: inline-block;
  }

  /* SOCIAL GRID (Ottimizzata Mobile) */
  .social-grid {
    display: grid;
    /* Due colonne su mobile (minimo 110px) invece di una */
    grid-template-columns: repeat(auto-fit, minmax(110px, 1fr)); 
    gap: 1rem;
  }

  .card {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    text-decoration: none;
    transition: transform 0.2s;
  }
  .card:active { transform: scale(0.98); } /* Feedback al tocco */

  .social-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1.2rem;
  }

  .icon-box { width: 32px; height: 32px; margin-bottom: 0.5rem; }
  .icon-box img { width: 100%; height: 100%; object-fit: contain; }
  .card-label { color: #fff; font-size: 0.9rem; font-weight: 600; }

  /* CATEGORIES GRID */
  .categories-grid {
    display: grid;
    grid-template-columns: 1fr; /* Una colonna su mobile per dare spazio all'immagine */
    gap: 1.5rem;
  }

  .category-card {
    position: relative; height: 180px; overflow: hidden;
  }
  
  .card-bg {
    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
    background-size: cover; background-position: center;
  }
  .category-card[data-category="writeups"] .card-bg { background-image: url('/images/writeups.jpg'); }
  .category-card[data-category="projects"] .card-bg { background-image: url('/images/projects.jpg'); }
  .category-card[data-category="university"] .card-bg { background-image: url('/images/pwncollege.svg'); background-size: contain; background-repeat: no-repeat; background-color: #111; }

  .card-content {
    position: relative; z-index: 2; width: 100%; height: 100%;
    background: rgba(26, 30, 37, 0.7);
    display: flex; flex-direction: column;
    justify-content: center; align-items: center;
  }

  .card-content h3 { color: #64ffda; font-size: 1.5rem; margin: 0; font-weight: 700; }
  .card-content p { color: #ccc; margin: 0.3rem 0 0.8rem; font-size: 0.9rem; }

  .btn-view {
    background: #64ffda; color: #1a1e25;
    padding: 0.4rem 1.2rem; border-radius: 20px;
    font-weight: bold; text-decoration: none; font-size: 0.85rem;
  }

  .dashboard-footer { text-align: center; color: #555; font-size: 0.8rem; margin-top: 2rem; }

  /* --- 5. DESKTOP OVERRIDES (Schermi Grandi) --- */
  @media (min-width: 1024px) {
    .fullscreen-dashboard {
      flex-direction: row;
      height: 100vh;
      overflow: hidden;
    }

    .profile-side {
      width: 35%;
      height: 100%;
      overflow-y: auto;
      border-right: 1px solid rgba(100, 255, 218, 0.1);
      border-bottom: none;
      background: linear-gradient(135deg, #16191f 0%, #1a1e25 100%);
      padding: 3rem 1rem;
    }

    .content-side {
      width: 65%;
      height: 100%;
      overflow-y: auto;
      padding: 4rem 3rem;
    }

    /* Ripristina grandezza elementi Desktop */
    .logo-container { width: 260px; height: 260px; margin-bottom: 2rem; }
    
    /* Mostra titolo descrizione solo su Desktop */
    .desc-title { 
      display: block; 
      color: #fff; font-size: 2rem; margin-bottom: 1rem;
      text-transform: uppercase; letter-spacing: 2px;
    }

    .desc-text { font-size: 1rem; }
    
    .social-grid { grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); }
    .icon-box { width: 40px; height: 40px; }
    
    .categories-grid { grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); }
    .category-card { height: 200px; }
    
    .card:hover { transform: translateY(-5px); border-color: #64ffda; box-shadow: 0 5px 15px rgba(0,0,0,0.3); }
    .category-card:hover .card-bg { transform: scale(1.05); }
    .category-card:hover .card-content { background: rgba(26, 30, 37, 0.6); }
  }

  /* Star Alert */
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
