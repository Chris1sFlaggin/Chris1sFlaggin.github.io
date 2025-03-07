---
layout: default
---

<div class="category-page">
  <div class="category-header" style="background-image: url('{{ page.background_image | default: "/assets/images/default-category.jpg" }}')">
    <h1>{{ page.title }}</h1>
  </div>
  
  <div class="post-list">
    {% for post in site.categories[page.category] %}
      <div class="post-card">
        <h2><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h2>
        <span class="post-date">{{ post.date | date: "%B %d, %Y" }}</span>
        {% if post.description %}
          <p>{{ post.description }}</p>
        {% endif %}
      </div>
    {% endfor %}
  </div>
</div>

<style>
  .category-page {
    padding: 0;
  }
  
  .category-header {
    padding: 4rem 2rem;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    position: relative;
    color: white;
    text-align: center;
  }

  .category-header::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
  }

  .category-header h1 {
    position: relative;
    z-index: 1;
  }

  .post-list {
    margin-top: 2rem;
  }

  .post-card {
    margin-bottom: 2rem;
    padding: 1.5rem;
    background: #252a34;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .post-date {
    color: #64ffda;
    font-size: 0.9rem;
  }
</style>
