layout: home

<div class="logo-animation">

  <img src="/images/chris.jpg" alt="Site Logo" class="animated-logo">

</div>

<style>

  .logo-animation {

    text-align: center;

    margin: 50px 0;

  }

  .animated-logo {

    max-width: 200px;

    animation: fadeInRotate 2s ease-in-out;

  }

  @keyframes fadeInRotate {

    0% {

      opacity: 0;

      transform: scale(0) rotate(-180deg);

    }

    100% {

      opacity: 1;

      transform: scale(1) rotate(0deg);

    }

  }

</style>
