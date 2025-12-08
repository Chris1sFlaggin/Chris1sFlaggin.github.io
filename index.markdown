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
  .social-section { 
    max-width: 1200px; 
    margin: 0 auto; 
    padding: clamp(2rem, 5vw, 4rem) clamp(1rem, 3vw, 2rem); 
    background: #252a34;
  }
  .social-section h2 { font-size: clamp(1.25rem, 4vw, 2rem); margin-bottom: 1.5rem; text-align: center; color: #64ffda; }

  /* Grid responsivo */
  .social-grid { display: grid; gap: 1.5rem; grid-template-columns: repeat(auto-fill, minmax(min(140px, 100%), 1fr)); }

  .social-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-decoration: none;
    background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
    backdrop-filter: blur(10px);
    border-radius: 16px;
    padding: clamp(0.9rem, 2vw, 1.2rem);
    box-shadow: 0 8px 24px rgba(0,0,0,0.1);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1), background 0.3s ease;
    color: inherit;
    border: 1px solid rgba(100, 255, 218, 0.1);
    min-height: 44px;
  }

  .social-card:focus,
  .social-card:hover { 
    transform: translateY(-8px) scale(1.05); 
    box-shadow: 0 20px 48px rgba(100, 255, 218, 0.2); 
    background: linear-gradient(135deg, rgba(100, 255, 218, 0.15), rgba(100, 255, 218, 0.08));
    border-color: rgba(100, 255, 218, 0.3);
  }

  @media (hover: none) and (pointer: coarse) {
    .social-card:hover { transform: none; }
    .social-card:active { transform: scale(0.98); }
  }

  .logo-wrap { width: 72px; height: 72px; display: grid; place-items: center; margin-bottom: 0.8rem; }
  .logo-wrap img { max-width: 100%; max-height: 100%; object-fit: contain; display: block; filter: drop-shadow(0 2px 8px rgba(100, 255, 218, 0.3)); transition: filter 0.3s ease; }

  .social-card:hover .logo-wrap img { filter: drop-shadow(0 4px 12px rgba(100, 255, 218, 0.5)); }

  /* Fallback badge */
  .fallback {
    width: 72px; height: 72px; border-radius: 16px; display: grid; place-items: center; font-weight: 700; font-size: 1.4rem;
    background: linear-gradient(135deg, #64ffda, #4cd3a7); color: #252a34;
  }

  .social-meta { text-align: center; }
  .social-name { display: block; font-size: clamp(0.9rem, 2vw, 1.05rem); font-weight: 600; color: #64ffda; }

  /* Small screens */
  @media (max-width: 480px) {
    .social-grid { gap: 0.75rem; }
    .logo-wrap { width: 52px; height: 52px; }
    .social-card { padding: 0.7rem; }
  }

  /* Hero Section Styles */
  .hero-section {
    min-height: 85vh;
    min-height: 85dvh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(135deg, #1a1e25 0%, #252a34 50%, #1a1e25 100%);
    overflow: hidden;
    padding: clamp(1rem, 4vw, 2rem);
    position: relative;
  }

  .hero-section::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at 50% 50%, rgba(100, 255, 218, 0.05) 0%, transparent 50%);
    pointer-events: none;
  }

  .logo-container {
    position: relative;
    width: clamp(200px, 40vw, 280px);
    height: clamp(200px, 40vw, 280px);
    z-index: 1;
  }

  @media (min-width: 768px) {
    .logo-container {
      width: clamp(260px, 30vw, 320px);
      height: clamp(260px, 30vw, 320px);
    }
  }

  .animated-logo {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
    position: relative;
    z-index: 2;
    border: 4px solid #64ffda;
    animation: glow 2s ease-in-out infinite;
    box-shadow: 0 0 30px rgba(100, 255, 218, 0.4);
  }

  .rays {
    position: absolute;
    width: 100%;
    height: 100%;
    background: conic-gradient(from 0deg, transparent 0%, rgba(100, 255, 218, 0.3) 50%, transparent 100%);
    animation: rotate 6s linear infinite;
    filter: blur(2px);
  }

  .pulse-ring {
    position: absolute;
    top: -10%;
    left: -10%;
    width: 120%;
    height: 120%;
    border-radius: 50%;
    border: 4px solid #64ffda;
    animation: pulse 2.5s ease-out infinite;
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
    0% { box-shadow: 0 0 20px rgba(100, 255, 218, 0.4), 0 0 40px rgba(100, 255, 218, 0.2); }
    50% { box-shadow: 0 0 30px rgba(100, 255, 218, 0.6), 0 0 60px rgba(100, 255, 218, 0.3); }
    100% { box-shadow: 0 0 20px rgba(100, 255, 218, 0.4), 0 0 40px rgba(100, 255, 218, 0.2); }
  }

  /* Category styles */
  .category-section {
    padding: clamp(2rem, 5vw, 4rem) clamp(1.5rem, 4vw, 2rem);
    background: #1a1e25;
    text-align: center;
  }

  .category-section h2 {
    font-size: clamp(1.8rem, 5vw, 2.5rem);
    margin-bottom: 1.5rem;
    color: #64ffda;
    font-weight: 700;
  }

  .category-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(280px, 100%), 1fr));
    gap: clamp(1.5rem, 3vw, 2.5rem);
    margin-top: 2rem;
    max-width: 1400px;
    margin-left: auto;
    margin-right: auto;
  }

  .category-card {
    position: relative;
    height: clamp(200px, 30vw, 280px);
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    background-size: cover;
    background-position: center;
  }

  @media (min-width: 768px) {
    .category-card {
      height: 280px;
    }
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
    background: rgba(37, 42, 52, 0.75);
    transition: background 0.4s ease;
  }

  .category-content {
    position: relative;
    z-index: 1;
    padding: clamp(1.5rem, 3vw, 2rem);
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .category-card:hover {
    transform: translateY(-8px) scale(1.03);
    box-shadow: 0 16px 40px rgba(100, 255, 218, 0.2);
  }

  @media (hover: none) and (pointer: coarse) {
    .category-card:hover {
      transform: none;
    }
    .category-card:active {
      transform: scale(0.98);
    }
  }

  .category-card:hover .category-overlay {
    background: rgba(37, 42, 52, 0.4);
  }

  .category-card h3 {
    color: #64ffda;
    margin-bottom: 0.8rem;
    font-size: clamp(1.3rem, 3vw, 1.8rem);
    font-weight: 700;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  }

  .category-card p {
    color: white;
    font-size: clamp(1rem, 2vw, 1.2rem);
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
  }

  .category-link {
    display: inline-block;
    margin-top: 1.2rem;
    padding: clamp(0.6rem, 2vw, 0.8rem) clamp(1.2rem, 3vw, 1.6rem);
    background: #64ffda;
    color: #252a34;
    border-radius: 8px;
    text-decoration: none;
    font-weight: bold;
    font-size: clamp(0.95rem, 2vw, 1.1rem);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    min-height: 44px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(100, 255, 218, 0.3);
  }

  .category-link:hover {
    background: #4cd3a7;
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(100, 255, 218, 0.5);
  }

  @media (hover: none) and (pointer: coarse) {
    .category-link:hover {
      transform: none;
    }
    .category-link:active {
      transform: scale(0.95);
    }
  }

  /* Recent Posts Section */
  .recent-posts-section {
    padding: clamp(1.5rem, 4vw, 2rem);
    background: #252a34;
    text-align: center;
  }
  
  .posts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(300px, 100%), 1fr));
    gap: clamp(1.5rem, 3vw, 2rem);
    margin-top: 2rem;
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;
  }
  
  .post-card {
    background: #1a1e25;
    border-radius: 8px;
    padding: clamp(1rem, 3vw, 1.5rem);
    text-align: left;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .post-card:hover {
    transform: translateY(-3px);
  }

  @media (hover: none) and (pointer: coarse) {
    .post-card:hover {
      transform: none;
    }
  }
  
  .post-card h3 a {
    color: #64ffda;
    text-decoration: none;
  }
  
  .post-card p {
    color: #ccc;
  }
  
  /* Footer */
  .site-footer {
    padding: clamp(1.5rem, 4vw, 2rem);
    background: #1a1e25;
    text-align: center;
    color: #ccc;
  }

  /* Desktop specific adjustments */
  @media (min-width: 1200px) {
    .hero-section {
      min-height: 75vh;
      min-height: 75dvh;
    }
    
    body {
      max-width: 100%;
      overflow-x: hidden;
    }
    
    .category-card {
      height: 300px;
    }

    .social-grid {
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 2rem;
    }

    .category-grid {
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    }

    .logo-container {
      width: 340px;
      height: 340px;
    }
  }

  /* Tablet adjustments */
  @media (min-width: 768px) and (max-width: 1199px) {
    .social-grid {
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      gap: 1.5rem;
    }
    
    .category-grid {
      gap: 2rem;
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
    padding: clamp(1.5rem, 4vw, 2.5rem);
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
    font-size: clamp(2.5em, 8vw, 3em);
    display: block;
    margin-bottom: 1rem;
    animation: sparkle 2s infinite;
  }
  
  .star-text {
    font-weight: 600;
    font-size: clamp(1em, 3vw, 1.1em);
    margin-bottom: 1.5rem;
    line-height: 1.4;
  }
  
  .star-button {
    background: #252a34;
    color: #64ffda;
    padding: clamp(10px, 3vw, 12px) clamp(20px, 5vw, 24px);
    border-radius: 12px;
    text-decoration: none;
    font-weight: bold;
    font-size: clamp(0.9em, 2.5vw, 1em);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border: 3px solid transparent;
    margin-bottom: 1rem;
    min-height: 44px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  
  .star-button:hover {
    background: #1a1e25;
    border-color: #252a34;
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(37, 42, 52, 0.4);
  }

  @media (hover: none) and (pointer: coarse) {
    .star-button:hover {
      transform: none;
    }
    .star-button:active {
      transform: scale(0.95);
    }
  }
  
  .close-button {
    position: absolute;
    top: clamp(10px, 3vw, 15px);
    right: clamp(15px, 4vw, 20px);
    background: rgba(37, 42, 52, 0.1);
    border: none;
    font-size: clamp(1.5em, 4vw, 1.8em);
    cursor: pointer;
    color: #252a34;
    opacity: 0.7;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    padding: 5px;
    border-radius: 50%;
    width: clamp(36px, 10vw, 40px);
    height: clamp(36px, 10vw, 40px);
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 44px;
    min-width: 44px;
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
      padding: clamp(1.2rem, 4vw, 1.5rem);
      margin: 1rem;
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