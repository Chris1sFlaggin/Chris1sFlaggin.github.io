---
layout: default
---

<div class="category-header">
  <h1>{{ page.title }}</h1>
  <p>Browse all posts in the {{ page.category }} category</p>
</div>

<div class="posts-list">
  {% for post in site.categories[page.category] %}
  <div class="post-item">
    {% if post.image %}
    <div class="post-image">
      <a href="{{ post.url | relative_url }}">
        <img src="{{ post.image | relative_url }}" alt="{{ post.title }}">
      </a>
    </div>
    {% endif %}
    <h2><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h2>
    <p class="post-date">{{ post.date | date: "%B %d, %Y" }}</p>
    <div class="post-excerpt">
      {{ post.excerpt }}
    </div>
    <a href="{{ post.url | relative_url }}" class="read-more">Read More →</a>
  </div>
  {% endfor %}
</div>

<style>
  .category-header {
    text-align: center;
    padding: 3rem 1rem;
    background-color: #252a34;
    margin-bottom: 2rem;
    border-bottom: 3px solid #64ffda;
  }
  
  .category-header h1 {
    color: #64ffda;
    margin-bottom: 0.5rem;
  }
  .post-item {
    margin-bottom: 3rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid #333;
  }
  
  .post-image {
    margin-bottom: 1rem;
  }
  
  .post-image img {
    width: 100%;
    max-width: 300px;
    height: 200px;
    object-fit: cover;
    border-radius: 8px;
    transition: opacity 0.3s ease;
  }
  
  .post-image img:hover {
    opacity: 0.8;
  }
  }
  
  .post-item {
    margin-bottom: 3rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid #333;
  }
  
  .post-item h2 a {
    color: #64ffda;
    text-decoration: none;
  }
  
  .post-item h2 a:hover {
    text-decoration: underline;
  }
  
  .post-date {
    color: #888;
    font-size: 0.9rem;
    margin-bottom: 1rem;
  }
  
  .read-more {
    display: inline-block;
    margin-top: 1rem;
    color: #64ffda;
    text-decoration: none;
    font-weight: bold;
  }
  
  .read-more:hover {
    text-decoration: underline;
  }
</style>
