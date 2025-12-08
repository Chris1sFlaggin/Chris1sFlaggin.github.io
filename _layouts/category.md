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
    padding: clamp(2.5rem, 5vw, 4rem) clamp(1rem, 3vw, 2rem);
    background: linear-gradient(135deg, #1a1e25 0%, #252a34 50%, #1a1e25 100%);
    margin-bottom: 2rem;
    border-bottom: 3px solid #64ffda;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
  
  .category-header h1 {
    color: #64ffda;
    margin-bottom: 0.8rem;
    font-size: clamp(2rem, 5vw, 3rem);
    font-weight: 700;
    text-shadow: 0 2px 8px rgba(100, 255, 218, 0.3);
  }

  .category-header p {
    font-size: clamp(1rem, 2.5vw, 1.3rem);
    color: #ccc;
  }
  
  .post-item {
    margin-bottom: clamp(2.5rem, 4vw, 3.5rem);
    padding: clamp(1.5rem, 3vw, 2rem);
    padding-bottom: clamp(1.5rem, 3vw, 2rem);
    border-bottom: 2px solid rgba(100, 255, 218, 0.2);
    background: rgba(255, 255, 255, 0.02);
    border-radius: 12px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .post-item:hover {
    background: rgba(100, 255, 218, 0.05);
    transform: translateX(8px);
    border-left: 3px solid #64ffda;
  }

  @media (hover: none) and (pointer: coarse) {
    .post-item:hover {
      transform: none;
    }
  }
  
  .post-image {
    margin-bottom: 1.2rem;
  }
  
  .post-image img {
    width: 100%;
    max-width: min(360px, 100%);
    height: auto;
    aspect-ratio: 3 / 2;
    object-fit: cover;
    border-radius: 12px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
  
  .post-image img:hover {
    opacity: 0.85;
    transform: scale(1.02);
    box-shadow: 0 8px 24px rgba(100, 255, 218, 0.2);
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
    font-size: clamp(1.4rem, 4vw, 2rem);
    font-weight: 700;
    transition: all 0.3s ease;
  }
  
  .post-item h2 a:hover {
    text-decoration: none;
    color: #4cd3a7;
    text-shadow: 0 2px 8px rgba(100, 255, 218, 0.3);
  }
  
  .post-date {
    color: #999;
    font-size: clamp(0.9rem, 2vw, 1rem);
    margin-bottom: 1rem;
    font-weight: 500;
  }

  .post-excerpt {
    font-size: clamp(0.95rem, 2.5vw, 1.1rem);
    line-height: 1.7;
    color: #ccc;
  }
  
  .read-more {
    display: inline-flex;
    align-items: center;
    margin-top: 1.2rem;
    padding: 0.6rem 1.2rem;
    background: rgba(100, 255, 218, 0.1);
    color: #64ffda;
    text-decoration: none;
    font-weight: bold;
    font-size: clamp(0.95rem, 2.5vw, 1.05rem);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    min-height: 44px;
    border-radius: 8px;
    border: 2px solid rgba(100, 255, 218, 0.3);
  }
  
  .read-more:hover {
    background: #64ffda;
    color: #252a34;
    transform: translateX(8px);
    box-shadow: 0 4px 12px rgba(100, 255, 218, 0.3);
  }

  @media (hover: none) and (pointer: coarse) {
    .read-more:hover {
      transform: none;
    }
  }

  /* Desktop specific improvements */
  @media (min-width: 1200px) {
    .posts-list {
      max-width: 1000px;
      margin: 0 auto;
    }

    .post-item {
      padding: 2rem;
    }

    .category-header {
      padding: 4rem 2rem;
    }
  }

  /* Tablet adjustments */
  @media (min-width: 768px) and (max-width: 1199px) {
    .posts-list {
      max-width: 800px;
      margin: 0 auto;
    }
  }
</style>
