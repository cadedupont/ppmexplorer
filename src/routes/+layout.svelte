<script>
  import '../app.css';
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
</style>
