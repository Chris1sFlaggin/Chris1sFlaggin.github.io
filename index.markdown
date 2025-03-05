<div class="hero-section">
  <div class="logo-container">
    <div class="rays"></div>
    <img src="/images/chris.jpg" alt="Security Specialist" class="animated-logo">
    <div class="pulse-ring"></div>
  </div>
</div>

<style>
  .hero-section {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #252a34;
    overflow: hidden;
  }

  .logo-container {
    position: relative;
    width: 200px;
    height: 200px;
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
    0% { box-shadow: 0 0 10px #64ffda; }
    50% { box-shadow: 0 0 20px #64ffda, 0 0 30px #64ffda; }
    100% { box-shadow: 0 0 10px #64ffda; }
  }
</style>
