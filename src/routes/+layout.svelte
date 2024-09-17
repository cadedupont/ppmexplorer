<script lang="ts">
  import { goto } from '$app/navigation';
  import Button from '@smui/button';
</script>

<nav>
  <Button on:click={() => goto('/')}>Loading Images</Button>
  <Button on:click={() => goto('/map')}>Map</Button>
</nav>

<slot />