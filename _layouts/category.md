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
    padding: clamp(2rem, 5vw, 3rem) clamp(1rem, 3vw, 2rem);
    background-color: #252a34;
    margin-bottom: 2rem;
    border-bottom: 3px solid #64ffda;
  }
  
  .category-header h1 {
    color: #64ffda;
    margin-bottom: 0.5rem;
    font-size: clamp(1.8rem, 5vw, 2.5rem);
  }

  .category-header p {
    font-size: clamp(0.9rem, 2.5vw, 1.1rem);
  }
  
  .post-item {
    margin-bottom: clamp(2rem, 4vw, 3rem);
    padding-bottom: clamp(1.5rem, 3vw, 2rem);
    border-bottom: 1px solid #333;
  }
  
  .post-image {
    margin-bottom: 1rem;
  }
  
  .post-image img {
    width: 100%;
    max-width: min(300px, 100%);
    height: auto;
    aspect-ratio: 3 / 2;
    object-fit: cover;
    border-radius: 8px;
    transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .post-image img:hover {
    opacity: 0.8;
  }
  
  @media (hover: none) and (pointer: coarse) {
    .post-image img:hover {
      opacity: 1;
    }
    .post-image img:active {
      opacity: 0.8;
    }
  }
  
  .post-item h2 a {
    color: #64ffda;
    text-decoration: none;
    font-size: clamp(1.3rem, 4vw, 1.7rem);
  }
  
  .post-item h2 a:hover {
    text-decoration: underline;
  }
  
  .post-date {
    color: #888;
    font-size: clamp(0.85rem, 2vw, 0.9rem);
    margin-bottom: 1rem;
  }

  .post-excerpt {
    font-size: clamp(0.9rem, 2.5vw, 1rem);
    line-height: 1.6;
  }
  
  .read-more {
    display: inline-flex;
    align-items: center;
    margin-top: 1rem;
    color: #64ffda;
    text-decoration: none;
    font-weight: bold;
    font-size: clamp(0.9rem, 2.5vw, 1rem);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    min-height: 44px;
  }
  
  .read-more:hover {
    text-decoration: underline;
    transform: translateX(5px);
  }

  @media (hover: none) and (pointer: coarse) {
    .read-more:hover {
      transform: none;
    }
  }
</style>
