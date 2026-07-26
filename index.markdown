---
layout: splash
title: "Home"
header:
  overlay_filter: rgba(0, 0, 0, 0)
---

<!-- Star Repository Alert -->
<div id="star-alert" class="star-alert">
  <div class="star-alert-content">
    <span class="star-icon">⭐</span>
    <span class="star-text"><span class="lang-it">Ti piace il sito?</span><span class="lang-en">Enjoying the site?</span></span>
    <br>
    <span class="star-text"><span class="lang-it">Lascia una stella su GitHub!</span><span class="lang-en">Leave a star on GitHub!</span></span>
    <br>
    <a href="https://github.com/Chris1sFlaggin/Chris1sFlaggin.github.io" target="_blank" class="star-button">
      <span class="lang-it">⭐ Stella</span><span class="lang-en">⭐ Star</span>
    </a>
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

<div class="lang-switch-container">
  <span class="lang-label">IT</span>
  <label class="switch">
    <input type="checkbox" id="lang-toggle">
    <span class="slider round"></span>
  </label>
  <span class="lang-label">EN</span>
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
        <h1 class="desc-title">chris1sflaggin</h1>
        <p class="desc-text">
          <span class="lang-it">Ho 22 anni e sto per laurearmi in informatica, con la tesi prevista per luglio 2026.
          Mi occupo di cybersecurity e sono tutor di pwn all'UniTo per CyberChallenge.it.
          Da novembre 2025 insegno anche alle superiori. Qui trovi i miei write-up CTF e i miei
          progetti personali. Buona permanenza!</span><span class="lang-en">{{ site.description | default: "I'm a IT student with a deep passion for cybersecurity. Here I'll post my CTF write ups and my own projects. Hope you enjoy your stay! 👋" }}</span>
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
      <h2 class="section-title"><span class="lang-it">CONTENUTI</span><span class="lang-en">CONTENTS</span></h2>
      <div class="categories-grid">
        {% assign sorted_categories = site.categories | sort %}
        
        {% for category in sorted_categories %}
          {% assign category_name = category | first %}
          
          {% unless category_name == 'stack' or category_name == 'Projects' %}

            <div class="card category-card" data-category="{{ category_name | slugify }}">
              <div class="card-bg"></div>
              <div class="card-content">
                <h3>{{ category_name | capitalize }}</h3>
                <p>{{ category | last | size }} post</p>
                <a href="{{ site.baseurl }}/categories/{{ category_name | slugify }}/" class="btn-view"><span class="lang-it">Apri</span><span class="lang-en">Access Data</span></a>
              </div>
            </div>

          {% endunless %}
        {% endfor %}
      </div>
    </div>
    
<div class="section-block">
      <h2 class="section-title"><span class="lang-it">PROGETTI</span><span class="lang-en">PROJECTS</span></h2>
      <div class="products-grid">

        <a href="{{ site.baseurl }}/botscraper/" class="card product-card project-card">
          <div class="card-content product-content">
            <h3>BotScraper</h3>
            <p><span class="lang-it">Analisi e pulizia dei follower bot su Instagram</span><span class="lang-en">Instagram bot-follower analysis and cleanup</span></p>
          </div>
        </a>

        <a href="https://github.com/chris1sflaggin/jaike" class="card product-card project-card">
          <div class="card-bg" style="background-image: url('/images/jake.png'); background-color: #f6e6c2; background-size: contain; background-repeat: no-repeat; background-position: center;"></div>

          <div class="card-content product-content">
            <h3>jAIke</h3>
            <p><span class="lang-it">Famiglio da desktop e gateway AI</span><span class="lang-en">Desktop familiar &amp; AI gateway</span></p>
          </div>
        </a>

        <a href="https://chris1sflaggin.it/votechain/" class="card product-card project-card">
          <div class="card-content product-content">
            <h3>VoteChain</h3>
            <p><span class="lang-it">Referendum e sondaggi su blockchain</span><span class="lang-en">Blockchain-based referendums and polls</span></p>
          </div>
        </a>

        <a href="{{ site.baseurl }}/joystick/" class="card product-card project-card">
          <div class="card-content product-content">
            <h3>Joystick MQTT</h3>
            <p><span class="lang-it">Telecomando analogico via browser</span><span class="lang-en">Analog remote control in the browser</span></p>
          </div>
        </a>

        {% for post in site.categories.Projects %}
          <a href="{{ post.url | relative_url }}" class="card product-card project-card">
            {% if post.image %}
              <div class="card-bg" style="background-image: url('{{ post.image | relative_url }}');"></div>
            {% endif %}
            <div class="card-content product-content">
              <h3>{{ post.title }}</h3>
              {% if post.description %}<p>{{ post.description }}</p>{% endif %}
            </div>
          </a>
        {% endfor %}

      </div>
    </div>

    <div class="section-block">
      <h2 class="section-title"><span class="lang-it">I MIEI PACCHETTI</span><span class="lang-en">MY PACKAGES</span></h2>
      <div class="products-grid">

        <a href="https://chris1sflaggin.it/LCSAJdump" class="card product-card">
          <div class="card-bg" style="background-image: url('/images/LCSAJfull.png');"></div>

          <div class="card-content product-content">
            <h3>LCSAJdump</h3>
            <p><span class="lang-it">Gadget finder per exploit development</span><span class="lang-en">Gadget finder for exploit development</span></p>
          </div>
        </a>

      </div>
    </div>

    <div class="section-block">
      <h2 class="section-title"><span class="lang-it">MATERIALE UNIVERSITARIO</span><span class="lang-en">UNIVERSITY MATERIAL</span></h2>
      <div class="products-grid">

        <a href="{{ site.baseurl }}/sicurezza/" class="card product-card uni-card">
          <div class="card-content product-content">
            <h3>Sicurezza</h3>
            <p><span class="lang-it">Flashcard, quiz e ripasso</span><span class="lang-en">Flashcards, quizzes and revision</span></p>
          </div>
        </a>

        <a href="{{ site.baseurl }}/sisint/" class="card product-card uni-card">
          <div class="card-content product-content">
            <h3>Sisint</h3>
            <p><span class="lang-it">Esami e simulatori</span><span class="lang-en">Past exams and simulators</span></p>
          </div>
        </a>

        <a href="{{ site.baseurl }}/sas/" class="card product-card uni-card">
          <div class="card-content product-content">
            <h3>SAS</h3>
            <p><span class="lang-it">Flashcard, esami e ripasso</span><span class="lang-en">Flashcards, past exams and revision</span></p>
          </div>
        </a>

      </div>
    </div>

    <div class="dashboard-footer">
      <small>© 2025 Chris1sFlaggin | <span class="lang-it">Sistema online</span><span class="lang-en">System Online</span></small>
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

  /* --- LANGUAGE SWITCHER --- */
  /* Stesso schema del layout cyber-post: la preferenza e' condivisa via localStorage */
  .lang-switch-container {
    position: fixed;
    top: 20px;
    right: 20px;
    display: flex;
    align-items: center;
    gap: 8px;
    z-index: 100;
    background: rgba(26, 30, 37, 0.9);
    border: 1px solid #64ffda;
    padding: 8px 15px;
    border-radius: 30px;
    backdrop-filter: blur(5px);
    color: #64ffda;
    font-weight: bold;
    font-size: 0.9rem;
  }

  .switch { position: relative; display: inline-block; width: 40px; height: 20px; }
  .switch input { opacity: 0; width: 0; height: 0; }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0; left: 0; right: 0; bottom: 0;
    background-color: transparent;
    transition: .4s;
    border-radius: 20px;
    border: 1px solid #64ffda;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 12px;
    width: 12px;
    left: 3px;
    bottom: 3px;
    background-color: #64ffda;
    transition: .4s;
    border-radius: 50%;
  }

  input:checked + .slider { background-color: rgba(100, 255, 218, 0.1); }
  input:checked + .slider:before { transform: translateX(20px); }

  /* Di default si vede l'italiano; con body.lang-en si scambiano */
  body:not(.lang-en) .lang-en { display: none !important; }
  body.lang-en .lang-it { display: none !important; }

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
  
.products-grid { 
    display: grid; 
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); /* Un po' più larghe */
    gap: 1.5rem; 
    margin-bottom: 2rem;
  }
  
  .product-card {
    position: relative;
    height: 320px; /* Altezza fissa per dare spazio all'immagine */
    overflow: hidden;
    border-radius: 12px;
    border: 1px solid rgba(100, 255, 218, 0.1);
    transition: transform 0.3s ease, border-color 0.3s ease;
  }

  /* Effetto Hover */
  .product-card:hover {
    transform: translateY(-5px);
    border-color: #64ffda;
  }
  
  .product-card:hover .card-bg {
    transform: scale(1.05); /* Zoom leggero dell'immagine all'hover */
  }

  /* Stile specifico per il contenuto dei prodotti */
  .product-content {
    background: rgba(26, 30, 37, 0.85); /* Sfondo scuro semitrasparente sopra l'immagine */
    text-align: center;
    padding: 1.5rem;
    justify-content: flex-end; /* Spinge il testo verso il basso (opzionale) */
  }

  .product-content h3 {
    color: #fff;
    font-size: 1.4rem;
    margin: 0 0 0.5rem 0;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .product-content p {
    color: #ccc;
    font-size: 0.95rem;
    margin-bottom: 1rem;
  }
  
  /* Project cards: stessa altezza per tutti, con o senza immagine */
  .project-card { height: 220px; }
  .project-card .product-content { justify-content: center; }
  .project-card .product-content h3 { font-size: 1.15rem; text-transform: none; letter-spacing: 0; }
  .project-card .product-content p { font-size: 0.88rem; margin-bottom: 0; }

  /* University cards */
  .uni-card { height: 160px; background: rgba(100, 255, 218, 0.04); }
  .uni-card .product-content { justify-content: center; background: transparent; height: 100%; }
  .uni-card .product-content h3 { color: #64ffda; }

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

  /* --- LANGUAGE SWITCHER --- */
  .lang-switch-container {
    position: fixed;
    top: 20px;
    right: 20px;
    display: flex;
    align-items: center;
    gap: 8px;
    z-index: 100;
    background: rgba(26, 30, 37, 0.9);
    border: 1px solid #64ffda;
    padding: 8px 15px;
    border-radius: 30px;
    backdrop-filter: blur(5px);
    color: #64ffda;
    font-weight: bold;
    font-size: 0.9rem;
  }

  .switch { position: relative; display: inline-block; width: 40px; height: 20px; }
  .switch input { opacity: 0; width: 0; height: 0; }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0; left: 0; right: 0; bottom: 0;
    background-color: transparent;
    transition: .4s;
    border-radius: 20px;
    border: 1px solid #64ffda;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 12px;
    width: 12px;
    left: 3px;
    bottom: 3px;
    background-color: #64ffda;
    transition: .4s;
    border-radius: 50%;
  }

  input:checked + .slider { background-color: rgba(100, 255, 218, 0.1); }
  input:checked + .slider:before { transform: translateX(20px); }

  /* LOGICA DI VISUALIZZAZIONE LINGUE */
  body:not(.lang-en) .lang-en { display: none !important; }
  body.lang-en .lang-it { display: none !important; }

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
<script>
(function () {
  // --- LANGUAGE SWITCHER ---
  // Stessa chiave usata dal layout cyber-post, così la scelta vale su tutto il sito.
  const langToggle = document.getElementById('lang-toggle');
  if (!langToggle) return;

  if (localStorage.getItem('preferred-lang') === 'en') {
    document.body.classList.add('lang-en');
    langToggle.checked = true;
  }

  langToggle.addEventListener('change', function () {
    if (this.checked) {
      document.body.classList.add('lang-en');
      localStorage.setItem('preferred-lang', 'en');
    } else {
      document.body.classList.remove('lang-en');
      localStorage.setItem('preferred-lang', 'it');
    }
  });
})();
</script>
