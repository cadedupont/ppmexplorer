<script lang="ts">
  import '@fontsource/pt-serif';
  import '@fontsource/bebas-neue'; 
  import logo from '$lib/assets/logo.png';
</script>

<svelte:head>
  <title>PPMExplorer</title>
</svelte:head>

<nav class="navbar">
  <a href="/" class="logo-link">
    <img src={logo} alt="PPMExplorer Logo" class="logo" />
  </a>
  <a href="/about" class="about-link">about</a>
</nav>

<slot></slot>

<style>
  :global(body) {
    font-family: 'PT Serif', serif;
  }

  :global(img) {
    pointer-events: none;
  }

  .navbar {
    display: flex;
    align-items: center;
    justify-content: center; /* Centers the logo */
    padding: 0 50px;
    position: relative; /* For positioning the about link */
  }

  .logo-link {
    flex-grow: 1; /* Allow the logo to take up available space */
    text-align: center;
  }

  .logo {
    width: 250px;  /* Adjust the width */
    height: auto;  /* Maintain aspect ratio */
  }

  .about-link {
    font-family: 'Bebas Neue', sans-serif;
    color: black;
    font-size: 24px;
    text-transform: uppercase;
    position: absolute; /* FOR THE LINK */
    right: 50px; /* Right edge */
  }
</style>
