<script lang="ts">
  export let data: { images: string[] };
</script>

{#each data.images as image}
  <button
    type="button"
    on:click={(event) => {
      event.preventDefault();
    }}
    on:keydown={(event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
      }
    }}
  >
    <img src={image} alt="test" />
  </button>
{/each}

<style>
  img {
    pointer-events: none;
  }
</style>
