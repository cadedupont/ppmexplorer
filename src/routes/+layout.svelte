<script>
  import { LightSwitch } from '@skeletonlabs/skeleton';
  import '../app.css';
  import '@fontsource/pt-serif';
</script>

<svelte:head>
  <title>PPMExplorer</title>
</svelte:head>

<nav class="bg-primary-500 p-6">
  <div class="container mx-auto flex justify-between items-center">
    <a href="/" class="text-white text-lg font-bold hover:text-gray-300 flex items-center">
      <img src="/logo.png" alt="PPMExplorer Logo" class="h-12 mr-2" />
      PPMExplorer
    </a>
    <div class="space-x-4 flex items-center">
      <a href="/" class="text-gray-300 hover:text-white text-sm">Home</a>
      <a href="/about" class="text-gray-300 hover:text-white text-sm">About</a>
      <LightSwitch />
    </div>
  </div>
</nav>

<slot></slot>

<style>
  :global(img) {
    pointer-events: none;
  }

  :global(body) {
    font-family: 'PT Serif', serif;
  }
</style>
