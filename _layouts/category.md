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
  
  .posts-list {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 1rem;
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
