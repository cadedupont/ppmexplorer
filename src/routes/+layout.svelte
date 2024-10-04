<script lang="ts">
  import '@fontsource/pt-serif';
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
  :global(body) {
    font-family: 'PT Serif', serif;
  }

  :global(img) {
    pointer-events: none;
  }
</style>