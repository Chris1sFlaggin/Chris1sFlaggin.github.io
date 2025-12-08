---
layout: home
---

<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-BL2501MC35"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-BL2501MC35');
</script>

<!-- Star Repository Alert -->
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

<div class="hero-section">
  <div class="logo-container">
    <div class="rays"></div>
    <img src="/images/chris.jpg" alt="Security Specialist" class="animated-logo">
    <div class="pulse-ring"></div>
  </div>
</div>

<div class="social-section">
  <h2>I miei profili</h2>
  <div class="social-grid">
    {% for account in site.data.social_accounts %}
      <a
        class="social-card"
        href="{{ account.url }}"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Apri {{ account.name }} (si apre in una nuova scheda)">

        <div class="logo-wrap">
          {% if account.logo %}
            <img src="{{ account.logo }}" alt="{{ account.alt | default: account.name }}" loading="lazy">
          {% else %}
            <!-- Fallback: simple SVG badge con iniziali -->
            <div class="fallback">{{ account.name | slice: 0,1 }}</div>
          {% endif %}
        </div>

        <div class="social-meta">
          <span class="social-name">{{ account.name }}</span>
        </div>
      </a>
    {% endfor %}
  </div>
</div>

<div class="category-section">
  <h2>Categories</h2>
  <div class="category-grid">
    {% for category in site.categories %}
      {% assign category_name = category | first %}
      <div class="category-card" data-category="{{ category_name | slugify }}">
        <div class="category-overlay"></div>
        <div class="category-content">
          <h3>{{ category_name }}</h3>
          <p>{{ site.categories[category_name].size }} posts</p>
          <a href="{{ site.baseurl }}/categories/{{ category_name | slugify }}/" class="category-link">View Posts</a>
        </div>
      </div>
    {% endfor %}
  </div>
</div>

<style>
  /* Layout generale */
  .social-section { max-width: min(1400px, 90vw); margin: clamp(1rem, 4vw, 3rem) auto; padding: 0 clamp(1rem, 3vw, 2rem); }
  .social-section h2 { font-size: clamp(1.5rem, 2.5vw, 2rem); margin-bottom: 1rem; }

  /* Grid responsivo */
  .social-grid { display: grid; gap: clamp(1rem, 2vw, 1.5rem); grid-template-columns: repeat(auto-fill, minmax(clamp(140px, 15vw, 180px), 1fr)); }

  .social-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-decoration: none;
    background: linear-gradient(180deg, rgba(255,255,255,0.6), rgba(255,255,255,0.4));
    border-radius: 12px;
    padding: clamp(0.8rem, 1.5vw, 1.2rem);
    box-shadow: 0 6px 18px rgba(0,0,0,0.06);
    transition: transform 0.18s ease, box-shadow 0.18s ease;
    color: inherit;
    border: 1px solid rgba(0,0,0,0.04);
  }

  .social-card:focus,
  .social-card:hover { transform: translateY(-6px); box-shadow: 0 16px 40px rgba(0,0,0,0.12); }

  .logo-wrap { width: clamp(56px, 8vw, 80px); height: clamp(56px, 8vw, 80px); display: grid; place-items: center; margin-bottom: clamp(0.5rem, 1vw, 0.8rem); }
  .logo-wrap img { max-width: 100%; max-height: 100%; object-fit: contain; display: block; }

  /* Fallback badge */
  .fallback {
    width: clamp(56px, 8vw, 80px); height: clamp(56px, 8vw, 80px); border-radius: 12px; display: grid; place-items: center; font-weight: 700; font-size: clamp(1rem, 1.8vw, 1.4rem);
    background: linear-gradient(135deg, #f3f4f6, #e5e7eb); color: #111827;
  }

  .social-meta { text-align: center; }
  .social-name { display: block; font-size: clamp(0.85rem, 1.3vw, 1rem); font-weight: 600; }

  /* Small screens */
  @media (max-width: 480px) {
    .logo-wrap { width: 52px; height: 52px; }
    .social-name { font-size: 0.9rem; }
  }

  /* Hero Section Styles */
  .hero-section {
    height: clamp(60vh, 80vh, 900px);
    display: flex;
    justify-content: center;
    align-items: center;
    background: #252a34;
    overflow: hidden;
    padding: clamp(1rem, 3vw, 3rem);
  }

  .logo-container {
    position: relative;
    width: clamp(180px, 20vw, 300px);
    height: clamp(180px, 20vw, 300px);
  }

  @media (min-width: 768px) {
    .logo-container {
      width: clamp(220px, 22vw, 320px);
      height: clamp(220px, 22vw, 320px);
    }
  }

  .animated-logo {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
    position: relative;
    z-index: 2;
    border: 3px solid #64ffda;
    animation: glow 2s ease-in-out infinite;
  }

  .rays {
    position: absolute;
    width: 100%;
    height: 100%;
    background: conic-gradient(from 0deg, transparent 0%, #64ffda 50%, transparent 100%);
    animation: rotate 4s linear infinite;
  }

  .pulse-ring {
    position: absolute;
    top: -10%;
    left: -10%;
    width: 120%;
    height: 120%;
    border-radius: 50%;
    border: 3px solid #64ffda;
    animation: pulse 2s ease-out infinite;
  }

  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @keyframes pulse {
    0% {
      transform: scale(0.95);
      opacity: 1;
    }
    100% {
      transform: scale(1.5);
      opacity: 0;
    }
  }
  
  @keyframes glow {
    0% { box-shadow: 0 0 5px rgba(100, 255, 218, 0.5); }
    50% { box-shadow: 0 0 20px rgba(100, 255, 218, 0.8); }
    100% { box-shadow: 0 0 5px rgba(100, 255, 218, 0.5); }
  }

  /* Category styles */
  .category-section {
    padding: clamp(1.5rem, 4vw, 3rem);
    background: #1a1e25;
    text-align: center;
  }

  .category-section h2 {
    font-size: clamp(1.5rem, 2.5vw, 2.5rem);
    margin-bottom: clamp(1rem, 2vw, 2rem);
  }

  .category-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(clamp(250px, 25vw, 350px), 1fr));
    gap: clamp(1.5rem, 3vw, 2.5rem);
    margin-top: clamp(1.5rem, 3vw, 2rem);
    max-width: min(1400px, 95vw);
    margin-left: auto;
    margin-right: auto;
  }

  .category-card {
    position: relative;
    height: clamp(180px, 20vh, 280px);
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    background-size: cover;
    background-position: center;
  }

  .category-card[data-category="writeups"] {
    background-image: url('/images/writeups.jpg');
  }

  .category-card[data-category="projects"] {
    background-image: url('/images/projects.jpg');
  }

  .category-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(37, 42, 52, 0.7);
    transition: background 0.3s ease;
  }

  .category-content {
    position: relative;
    z-index: 1;
    padding: clamp(1rem, 2vw, 1.5rem);
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .category-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }

  .category-card:hover .category-overlay {
    background: rgba(37, 42, 52, 0.5);
  }

  .category-card h3 {
    color: #64ffda;
    margin-bottom: 0.5rem;
    font-size: clamp(1.2rem, 2vw, 1.8rem);
  }

  .category-card p {
    color: white;
    font-size: clamp(0.9rem, 1.5vw, 1.1rem);
  }

  .category-link {
    display: inline-block;
    margin-top: clamp(0.5rem, 1vw, 1rem);
    padding: clamp(0.4rem, 1vw, 0.6rem) clamp(0.8rem, 2vw, 1.2rem);
    background: #64ffda;
    color: #252a34;
    border-radius: 4px;
    text-decoration: none;
    font-weight: bold;
    font-size: clamp(0.85rem, 1.2vw, 1rem);
    transition: background 0.3s ease;
  }

  .category-link:hover {
    background: #4cd3a7;
  }

  /* Recent Posts Section */
  .recent-posts-section {
    padding: clamp(1.5rem, 4vw, 3rem);
    background: #252a34;
    text-align: center;
  }
  
  .posts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(clamp(280px, 30vw, 350px), 1fr));
    gap: clamp(1.5rem, 3vw, 2.5rem);
    margin-top: clamp(1.5rem, 3vw, 2rem);
    max-width: min(1400px, 95vw);
    margin-left: auto;
    margin-right: auto;
  }
  
  .post-card {
    background: #1a1e25;
    border-radius: 8px;
    padding: clamp(1rem, 2vw, 1.5rem);
    text-align: left;
  }
  
  .post-card h3 a {
    color: #64ffda;
    text-decoration: none;
    font-size: clamp(1.1rem, 2vw, 1.4rem);
  }
  
  .post-card p {
    color: #ccc;
    font-size: clamp(0.9rem, 1.5vw, 1rem);
  }
  
  /* Footer */
  .site-footer {
    padding: clamp(1.5rem, 3vw, 2rem);
    background: #1a1e25;
    text-align: center;
    color: #ccc;
    font-size: clamp(0.9rem, 1.2vw, 1rem);
  }

  /* Desktop specific adjustments */
  @media (min-width: 1200px) {
    .hero-section {
      height: clamp(65vh, 75vh, 850px);
    }
    
    body {
      max-width: 100%;
      overflow-x: hidden;
    }
    
    .category-card {
      height: clamp(220px, 22vh, 300px);
    }

    .social-section,
    .category-section,
    .recent-posts-section {
      padding-left: max(1rem, calc((100vw - 1400px) / 2));
      padding-right: max(1rem, calc((100vw - 1400px) / 2));
    }
  }

  /* Ultra-wide screen optimization */
  @media (min-width: 1600px) {
    .social-grid {
      grid-template-columns: repeat(auto-fill, minmax(160px, 200px));
    }
    
    .category-grid,
    .posts-grid {
      gap: 3rem;
    }
  }

  .star-alert {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(5px);
    z-index: 10000;
    display: flex;
    justify-content: center;
    align-items: center;
    animation: fadeIn 0.5s ease-out;
    transition: all 0.3s ease;
  }
  
  .star-alert.hidden {
    animation: fadeOut 0.3s ease-in forwards;
  }
  
  .star-alert-content {
    background: linear-gradient(135deg, #64ffda, #4cd3a7);
    color: #252a34;
    padding: clamp(1.5rem, 3vw, 2.5rem) clamp(2rem, 4vw, 3rem);
    border-radius: 20px;
    box-shadow: 0 20px 60px rgba(100, 255, 218, 0.4);
    max-width: min(400px, 90vw);
    width: 90%;
    text-align: center;
    position: relative;
    transform: scale(0.8);
    animation: popIn 0.5s ease-out 0.2s forwards;
  }
  
  .star-icon {
    font-size: clamp(2.5em, 5vw, 3.5em);
    display: block;
    margin-bottom: 1rem;
    animation: sparkle 2s infinite;
  }
  
  .star-text {
    font-weight: 600;
    font-size: clamp(1em, 2vw, 1.2em);
    margin-bottom: 1.5rem;
    line-height: 1.4;
  }
  
  .star-button {
    background: #252a34;
    color: #64ffda;
    padding: clamp(10px, 2vw, 14px) clamp(20px, 3vw, 28px);
    border-radius: 12px;
    text-decoration: none;
    font-weight: bold;
    font-size: clamp(0.9em, 1.5vw, 1.1em);
    transition: all 0.3s ease;
    border: 3px solid transparent;
    display: inline-block;
    margin-bottom: 1rem;
  }
  
  .star-button:hover {
    background: #1a1e25;
    border-color: #252a34;
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(37, 42, 52, 0.4);
  }
  
  .close-button {
    position: absolute;
    top: 15px;
    right: 20px;
    background: rgba(37, 42, 52, 0.1);
    border: none;
    font-size: 1.8em;
    cursor: pointer;
    color: #252a34;
    opacity: 0.7;
    transition: all 0.3s ease;
    padding: 5px;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .close-button:hover {
    opacity: 1;
    background: rgba(37, 42, 52, 0.2);
    transform: rotate(90deg);
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  @keyframes fadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
  
  @keyframes popIn {
    from {
      transform: scale(0.8);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }
  
  @keyframes sparkle {
    0%, 100% {
      transform: scale(1) rotate(0deg);
    }
    25% {
      transform: scale(1.1) rotate(-5deg);
    }
    50% {
      transform: scale(1.2) rotate(0deg);
    }
    75% {
      transform: scale(1.1) rotate(5deg);
    }
  }
  
  /* Mobile responsive */
  @media (max-width: 768px) {
    .star-alert-content {
      padding: 1.5rem 2rem;
      margin: 1rem;
    }
    
    .star-icon {
      font-size: 2.5em;
    }
    
    .star-text {
      font-size: 1em;
    }
    
    .star-button {
      padding: 10px 20px;
      font-size: 0.9em;
    }
  }
</style>

<script>
(function() {
  const STORAGE_KEY = 'star-alert-dismissed';
  const SHOW_DELAY = 5000; // 5 seconds after page load
  
  function showStarAlert() {
    // Check if user has already dismissed the alert
    // if (localStorage.getItem(STORAGE_KEY) === 'true') {
    //   return;
    // }
    
    const alert = document.getElementById('star-alert');
    const closeButton = document.getElementById('close-star-alert');
    
    if (!alert || !closeButton) return;
    
    // Show alert after delay
    setTimeout(() => {
      alert.style.display = 'block';
    }, SHOW_DELAY);
    
    // Handle close button
    closeButton.addEventListener('click', function() {
      alert.classList.add('hidden');
      localStorage.setItem(STORAGE_KEY, 'true');
      
      setTimeout(() => {
        alert.style.display = 'none';
      }, 300);
    });
    
    // Auto-hide after 10 seconds if not interacted with
    setTimeout(() => {
      if (alert.style.display !== 'none' && !alert.classList.contains('hidden')) {
        alert.classList.add('hidden');
        setTimeout(() => {
          alert.style.display = 'none';
        }, 300);
      }
    }, 15000);
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', showStarAlert);
  } else {
    showStarAlert();
  }
})();
</script>