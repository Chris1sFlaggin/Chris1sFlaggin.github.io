---
layout: home
---

<div class="hero-section">
  <div class="logo-container">
    <div class="rays"></div>
    <img src="/images/chris.jpg" alt="Security Specialist" class="animated-logo">
    <div class="pulse-ring"></div>
  </div>
</div>

<div class="social-section">
  <h2>Seguimi anche su</h2>
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

<div class="recent-posts-section">
  <h2>Recent Posts</h2>
  <div class="posts-grid">
    {% for post in site.posts limit:2 %}
      <div class="post-card">
        <h3><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h3>
        <p>{{ post.excerpt | strip_html | truncatewords: 30 }}</p>
      </div>
    {% endfor %}
  </div>
</div>

<footer class="site-footer">
  <div class="footer-content">
    <p>© 2025 Chris1sFlaggin. Powered by Jekyll & Minimal Mistakes.</p>
  </div>
</footer>

<style>
  /* Layout generale */
  .social-section { max-width: 1100px; margin: 2rem auto; padding: 0 1rem; }
  .social-section h2 { font-size: 1.5rem; margin-bottom: 1rem; }

  /* Grid responsivo */
  .social-grid { display: grid; gap: 1rem; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); }

  .social-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-decoration: none;
    background: linear-gradient(180deg, rgba(255,255,255,0.6), rgba(255,255,255,0.4));
    border-radius: 12px;
    padding: 0.9rem;
    box-shadow: 0 6px 18px rgba(0,0,0,0.06);
    transition: transform 0.18s ease, box-shadow 0.18s ease;
    color: inherit;
    border: 1px solid rgba(0,0,0,0.04);
  }

  .social-card:focus,
  .social-card:hover { transform: translateY(-6px); box-shadow: 0 16px 40px rgba(0,0,0,0.12); }

  .logo-wrap { width: 64px; height: 64px; display: grid; place-items: center; margin-bottom: 0.6rem; }
  .logo-wrap img { max-width: 100%; max-height: 100%; object-fit: contain; display: block; }

  /* Fallback badge */
  .fallback {
    width: 64px; height: 64px; border-radius: 12px; display: grid; place-items: center; font-weight: 700; font-size: 1.2rem;
    background: linear-gradient(135deg, #f3f4f6, #e5e7eb); color: #111827;
  }

  .social-meta { text-align: center; }
  .social-name { display: block; font-size: 0.95rem; font-weight: 600; }

  /* Small screens */
  @media (max-width: 480px) {
    .logo-wrap { width: 52px; height: 52px; }
    .social-name { font-size: 0.9rem; }
  }

  /* Hero Section Styles */
  .hero-section {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #252a34;
    overflow: hidden;
    padding: 2rem;
  }

  .logo-container {
    position: relative;
    width: 200px;
    height: 200px;
  }

  @media (min-width: 768px) {
    .logo-container {
      width: 250px;
      height: 250px;
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
    padding: 2rem;
    background: #1a1e25;
    text-align: center;
  }

  .category-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;
  }

  .category-card {
    position: relative;
    height: 200px;
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
    padding: 1.5rem;
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
  }

  .category-card p {
    color: white;
  }

  .category-link {
    display: inline-block;
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    background: #64ffda;
    color: #252a34;
    border-radius: 4px;
    text-decoration: none;
    font-weight: bold;
    transition: background 0.3s ease;
  }

  .category-link:hover {
    background: #4cd3a7;
  }

  /* Recent Posts Section */
  .recent-posts-section {
    padding: 2rem;
    background: #252a34;
    text-align: center;
  }
  
  .posts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;
  }
  
  .post-card {
    background: #1a1e25;
    border-radius: 8px;
    padding: 1.5rem;
    text-align: left;
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
    padding: 2rem;
    background: #1a1e25;
    text-align: center;
    color: #ccc;
  }

  /* Desktop specific adjustments */
  @media (min-width: 1200px) {
    .hero-section {
      height: 80vh;
    }
    
    body {
      max-width: 100%;
      overflow-x: hidden;
    }
    
    .category-card {
      height: 250px;
    }
  }
</style>