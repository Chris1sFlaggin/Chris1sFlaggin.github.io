---
layout: default
---

<div class="cyber-container">
  <div class="cyber-header">
    <h1 class="glitch-text" data-text="{{ page.title }}">{{ page.title }}</h1>
    <div class="cyber-line"></div>
    <p class="cyber-subtitle">Directory listing for: <span class="path">~/categories/{{ page.category }}</span></p>
  </div>

  <div class="posts-grid">
    {% assign sorted_posts = site.categories[page.category] | sort: 'date' | reverse %}
    {% for post in sorted_posts %}
      <a href="{{ post.url | relative_url }}" class="cyber-card-item">
        <div class="card-border"></div>
        <div class="card-body">
          <span class="date-badge">
            <i class="fas fa-terminal"></i> {{ post.date | date: "%Y-%m-%d" }}
          </span>
          <h3>{{ post.title }}</h3>
          <p>{{ post.excerpt | strip_html | truncatewords: 20 }}</p>
          <div class="read-more">EXECUTE ></div>
        </div>
      </a>
    {% endfor %}
  </div>

  <div class="back-link">
    <a href="{{ site.baseurl }}/">< [cd ..] Return to Root</a>
  </div>
</div>

<style>
  /* Cyber Layout Styles */
  body {
    background-color: #1a1e25;
    color: #e0e0e0;
    font-family: 'Courier New', Courier, monospace;
  }

  .cyber-container {
    max-width: 1000px;
    margin: 4rem auto;
    padding: 0 20px;
  }

  .cyber-header {
    margin-bottom: 3rem;
    text-align: left;
  }

  .glitch-text {
    font-size: 3rem;
    color: #64ffda;
    text-transform: uppercase;
    margin: 0;
    letter-spacing: 2px;
    text-shadow: 2px 2px 0px #0a0a0a;
  }

  .cyber-line {
    height: 2px;
    background: linear-gradient(90deg, #64ffda 0%, transparent 100%);
    margin: 1rem 0;
  }

  .cyber-subtitle {
    color: #8892b0;
    font-size: 1rem;
  }

  .path {
    color: #ff79c6;
    background: rgba(255, 121, 198, 0.1);
    padding: 2px 6px;
    border-radius: 4px;
  }

  /* Grid System */
  .posts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 25px;
  }

  /* Cyber Card */
  .cyber-card-item {
    position: relative;
    display: block;
    text-decoration: none;
    background: #111;
    transition: transform 0.2s ease;
  }

  .cyber-card-item:hover {
    transform: translateY(-5px);
  }

  .card-border {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    border: 1px solid #333;
    z-index: 1;
    transition: border-color 0.3s;
  }

  .cyber-card-item:hover .card-border {
    border-color: #64ffda;
    box-shadow: 0 0 15px rgba(100, 255, 218, 0.1);
  }

  .card-body {
    position: relative;
    z-index: 2;
    padding: 20px;
  }

  .date-badge {
    display: block;
    color: #64ffda;
    font-size: 0.8rem;
    margin-bottom: 10px;
    font-family: monospace;
  }

  .cyber-card-item h3 {
    margin: 0 0 10px 0;
    color: #fff;
    font-size: 1.4rem;
  }

  .cyber-card-item p {
    color: #8892b0;
    font-size: 0.9rem;
    line-height: 1.5;
  }

  .read-more {
    margin-top: 15px;
    color: #64ffda;
    font-weight: bold;
    font-size: 0.9rem;
    opacity: 0.8;
  }

  .cyber-card-item:hover .read-more {
    opacity: 1;
    text-decoration: underline;
  }

  .back-link {
    margin-top: 3rem;
  }
  
  .back-link a {
    color: #8892b0;
    text-decoration: none;
    font-family: monospace;
    font-size: 1.1rem;
  }
  
  .back-link a:hover {
    color: #64ffda;
  }
</style>