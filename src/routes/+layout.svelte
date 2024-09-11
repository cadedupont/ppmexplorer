<script lang="ts">
  import { goto } from '$app/navigation';
  import Button from '@smui/button';
</script>

<nav>
  <Button on:click={() => goto('/')}>Home</Button>
  <Button on:click={() => goto('/map')}>Map</Button>
  <Button on:click={() => goto('/images_example')}>Images Example</Button>
</nav>

<slot />