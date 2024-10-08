<script>
  import '../app.css';
  import '@fontsource/ubuntu';
</script>

<svelte:head>
  <title>PPMExplorer</title>
</svelte:head>

<nav>
  <a href="/">home</a>
  <a href="/about">about</a>
</nav>

<slot></slot>

<style>
  :global(img) {
    pointer-events: none;
  }

  :global(body) {
    font-family: 'Ubuntu', sans-serif;
  }
</style>
