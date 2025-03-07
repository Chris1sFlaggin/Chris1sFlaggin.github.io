---
layout: default
---

<div class="category-page">
  <h1>{{ page.title }}</h1>
  
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
    padding: 2rem;
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
