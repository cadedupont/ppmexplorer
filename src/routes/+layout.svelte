<script>
  import '../app.css';
  import '@fontsource/ubuntu';
</script>

<svelte:head>
  <title>PPMExplorer</title>
</svelte:head>

<nav class="bg-gray-800 p-4">
  <div class="container mx-auto flex justify-between items-center">
    <a href="/" class="text-white text-lg font-bold hover:text-gray-300">
      PPMExplorer
    </a>2
    <div class="space-x-4">
      <a href="/" class="text-gray-300 hover:text-white text-sm">Home</a>
      <a href="/about" class="text-gray-300 hover:text-white text-sm">About</a>
    </div>
  </div>
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
