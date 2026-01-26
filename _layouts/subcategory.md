---
layout: default
---

<div class="cyber-console-wrapper">
  <div class="cyber-console">
    <div class="console-header">
      <div class="buttons">
        <span class="btn red"></span>
        <span class="btn yellow"></span>
        <span class="btn green"></span>
      </div>
      <div class="title">
        root@chris1sflaggin:~/categories/{{ page.category | downcase }}
      </div>
    </div>
    
    <div class="console-body">
      <h1 class="glitch-title">{{ page.title }}</h1>
      <div class="scan-line"></div>
      
      <p class="system-msg">
        > INITIALIZING SUB-ROUTINE...<br>
        > FETCHING ENCRYPTED DATA... [ OK ]
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
              <div class="card-content">
                <div class="card-header">
                  <span class="file-perm">RWX</span>
                  <span class="file-date">{{ post.date | date: "%Y-%m-%d" }}</span>
                </div>
                <h3 class="file-name">{{ post.title }}</h3>
                <p class="file-excerpt">{{ post.excerpt | strip_html | truncatewords: 15 }}</p>
                <div class="status-bar">
                  <span class="cmd-prompt">$ ./read_post</span>
                  <span class="cursor">_</span>
                </div>
              </div>
            </a>
          {% endfor %}
        {% else %}
          <div class="error-box">
            <p class="error-msg">ERROR 404: No data found in sector '{{ page.category }}'.</p>
            <p>Check category name in Front Matter.</p>
          </div>
        {% endif %}
      </div>
      
      <div class="cmd-footer">
        <a href="{{ site.baseurl }}/" class="back-cmd">&lt; cd .. (Return to Root)</a>
      </div>
    </div>
  </div>
</div>

<style>
  /* --- CYBER LAYOUT --- */
  .cyber-console-wrapper {
    width: 100%;
    padding: 20px 0;
    box-sizing: border-box;
  }

  .cyber-console {
    width: 100%;
    max-width: 100%; /* Ensures it doesn't overflow */
    margin: 0 auto;
    background-color: #0d1117;
    border: 1px solid #30363d;
    border-radius: 6px;
    box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
    overflow: hidden;
    font-family: 'Courier New', Courier, monospace;
  }

  /* Console Header (Mac/Linux style) */
  .console-header {
    background: #161b22;
    padding: 10px 15px;
    border-bottom: 1px solid #30363d;
    display: flex;
    align-items: center;
    position: relative;
  }

  .buttons { display: flex; gap: 8px; }
  .btn { width: 12px; height: 12px; border-radius: 50%; display: inline-block; }
  .red { background-color: #ff5f56; }
  .yellow { background-color: #ffbd2e; }
  .green { background-color: #27c93f; }

  .console-header .title {
    position: absolute;
    left: 0; right: 0;
    text-align: center;
    color: #8b949e;
    font-size: 0.8rem;
    font-weight: bold;
    pointer-events: none;
  }

  .console-body {
    padding: 2rem;
    color: #c9d1d9;
  }

  .glitch-title {
    margin: 0;
    color: #58a6ff;
    font-size: 2rem;
    text-shadow: 0 0 5px rgba(88, 166, 255, 0.5);
    border-bottom: 2px solid #30363d;
    padding-bottom: 10px;
  }

  .scan-line {
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, transparent, #58a6ff, transparent);
    margin-top: -2px;
    opacity: 0.7;
    margin-bottom: 20px;
  }

  .system-msg {
    color: #8b949e;
    font-size: 0.9rem;
    margin-bottom: 2rem;
  }

  /* Grid */
  .posts-grid-cyber {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); /* Responsive grid */
    gap: 20px;
  }

  /* Card */
  .cyber-card {
    background: #161b22;
    border: 1px solid #30363d;
    border-radius: 6px;
    text-decoration: none;
    transition: all 0.2s ease;
    display: block;
  }

  .cyber-card:hover {
    border-color: #58a6ff;
    transform: translateY(-3px);
    box-shadow: 0 4px 15px rgba(88, 166, 255, 0.15);
  }

  .card-content { padding: 1.5rem; }

  .card-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    font-size: 0.75rem;
    color: #8b949e;
  }
  
  .file-perm { color: #238636; }

  .file-name {
    color: #e0e0e0;
    font-size: 1.2rem;
    margin: 0 0 10px 0;
  }
  
  .cyber-card:hover .file-name { color: #58a6ff; }

  .file-excerpt {
    color: #8b949e;
    font-size: 0.9rem;
    line-height: 1.5;
    margin-bottom: 15px;
  }

  .status-bar {
    font-size: 0.85rem;
    color: #58a6ff;
  }
  
  .cursor { animation: blink 1s infinite; }
  @keyframes blink { 50% { opacity: 0; } }

  .cmd-footer { margin-top: 3rem; border-top: 1px solid #30363d; padding-top: 1rem; }
  .back-cmd { color: #8b949e; text-decoration: none; font-weight: bold; }
  .back-cmd:hover { color: #58a6ff; }
  
  .error-box { padding: 20px; border: 1px solid #ff5f56; background: rgba(255, 95, 86, 0.1); border-radius: 6px; color: #ff5f56; }
</style>