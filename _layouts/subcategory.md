---
layout: default
---

<div class="cyber-console">
  <div class="console-header">
    <span class="prompt">root@chris1sflaggin:~/categories/{{ page.category | downcase }}#</span> <span class="cursor">_</span>
  </div>
  
  <div class="console-body">
    <h1 class="glitch-title" data-text="{{ page.title }}">{{ page.title }}</h1>
    <div class="scan-line"></div>
    
    <p class="system-msg">
      > ACCESSING SECURE ARCHIVES...<br>
      > DECRYPTING ENTRIES...
    </p>

    <div class="posts-grid-cyber">
      {% assign cat_key = page.category %}
      {% assign posts = site.categories[cat_key] %}
      
      {% unless posts %}
        {% assign cat_key_down = page.category | downcase %}
        {% assign posts = site.categories[cat_key_down] %}
      {% endunless %}

      {% if posts and posts.size > 0 %}
        {% assign sorted_posts = posts | sort: 'date' | reverse %}
        
        {% for post in sorted_posts %}
          <a href="{{ post.url | relative_url }}" class="cyber-card">
            <div class="card-decoration top-left"></div>
            <div class="card-decoration top-right"></div>
            <div class="card-decoration bottom-left"></div>
            <div class="card-decoration bottom-right"></div>
            
            <div class="card-content">
              <span class="file-perm">drwxr-xr-x</span>
              <span class="file-date">{{ post.date | date: "%Y-%m-%d" }}</span>
              <h3 class="file-name">{{ post.title }}</h3>
              <p class="file-excerpt">{{ post.excerpt | strip_html | truncatewords: 20 }}</p>
              <div class="status-bar">
                <span class="status-ok">[ EXECUTE ]</span>
              </div>
            </div>
          </a>
        {% endfor %}
      {% else %}
        <p class="error-msg">ERROR: No data found in sector '{{ page.category }}'.</p>
      {% endif %}
    </div>
    
    <div class="cmd-footer">
      <a href="{{ site.baseurl }}/" class="back-cmd">< [cd ..] Return to Root</a>
    </div>
  </div>
</div>

<style>
  /* Cyber Layout Styles */
  .cyber-console {
    max-width: 1000px;
    margin: 2rem auto;
    padding: 0 1rem;
    font-family: 'Courier New', Courier, monospace;
    color: #e0e0e0;
  }

  .console-header {
    background: #111;
    padding: 10px 20px;
    border-top: 2px solid #64ffda;
    border-radius: 5px 5px 0 0;
    font-size: 0.9rem;
    margin-bottom: 2rem;
  }

  .prompt { color: #64ffda; font-weight: bold; }
  .cursor { animation: blink 1s infinite; color: #64ffda; }
  
  @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }

  .glitch-title {
    font-size: 2.5rem;
    color: #fff;
    text-transform: uppercase;
    margin: 0;
    text-shadow: 2px 2px 0px #03a9f4;
    letter-spacing: 2px;
  }

  .scan-line {
    height: 2px;
    background: linear-gradient(90deg, transparent, #64ffda, transparent);
    margin: 1rem 0 2rem 0;
    opacity: 0.7;
  }

  .system-msg {
    color: #8892b0;
    font-size: 0.9rem;
    margin-bottom: 2rem;
    line-height: 1.6;
  }

  /* Grid System */
  .posts-grid-cyber {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 30px;
  }

  /* Cyber Card */
  .cyber-card {
    display: block;
    position: relative;
    background: #161b22;
    border: 1px solid #30363d;
    text-decoration: none;
    transition: transform 0.2s, box-shadow 0.2s;
    overflow: hidden;
  }

  .cyber-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 0 15px rgba(100, 255, 218, 0.15);
    border-color: #64ffda;
  }

  .cyber-card:hover .status-ok {
    background: #64ffda;
    color: #000;
  }

  .card-content { padding: 20px; }

  /* Angoli decorativi */
  .card-decoration {
    position: absolute;
    width: 10px; height: 10px;
    transition: all 0.3s;
  }
  .top-left { top: 0; left: 0; border-top: 2px solid #64ffda; border-left: 2px solid #64ffda; }
  .top-right { top: 0; right: 0; border-top: 2px solid #64ffda; border-right: 2px solid #64ffda; }
  .bottom-left { bottom: 0; left: 0; border-bottom: 2px solid #64ffda; border-left: 2px solid #64ffda; }
  .bottom-right { bottom: 0; right: 0; border-bottom: 2px solid #64ffda; border-right: 2px solid #64ffda; }

  .file-perm, .file-date {
    font-size: 0.75rem;
    color: #64ffda;
    opacity: 0.7;
    display: block;
    margin-bottom: 5px;
  }

  .file-name {
    color: #fff;
    margin: 10px 0;
    font-size: 1.2rem;
  }

  .file-excerpt {
    color: #8b949e;
    font-size: 0.9rem;
    line-height: 1.5;
    margin-bottom: 20px;
  }

  .status-bar {
    text-align: right;
  }

  .status-ok {
    border: 1px solid #64ffda;
    color: #64ffda;
    padding: 2px 8px;
    font-size: 0.8rem;
    transition: all 0.2s;
  }
  
  .error-msg { color: #ff5555; }

  .cmd-footer { margin-top: 4rem; border-top: 1px solid #30363d; padding-top: 1rem; }
  .back-cmd { color: #8892b0; text-decoration: none; }
  .back-cmd:hover { color: #64ffda; }
</style>