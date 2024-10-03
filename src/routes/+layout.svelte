<script lang="ts">
  import '@fontsource/roboto';
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
    font-family: 'Roboto', sans-serif;
  }
</style>