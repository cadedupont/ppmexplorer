<script lang="ts">
  import Card from '@smui/card';
  import type { PPMRecord } from '$lib/types';

  export let data;
  let query = '';
  let results: PPMRecord[] = [];

  const search = async () => {
    const response = await fetch('/api/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query })
    });
    const data = await response.json();
    results = data.results;
  };
</script>

<main>
  <h1>PPMExplorer</h1>
  <input type="text" bind:value={query} placeholder="Enter search query" />
  <button on:click={search}>Search</button>

  {#if results.length > 0}
    <div class="grid-container">
      {#each results as result}
        <div class="card-container">
          <Card>
            <h2>Volume {result.volume}</h2>
            <h3>Regio {result.regio}, Insula {result.insula}</h3>
            <img
              class="card-image"
              src={`${result.imageURL}${data.blobSasToken}`}
              alt={result.id}
            />
            <p>{result.caption}</p>
          </Card>
        </div>
      {/each}
    </div>
  {/if}
</main>

<style>
  .grid-container {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-template-rows: repeat(4, auto);
    gap: 20px;
  }

  .card-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
  }

  .card-image {
    width: 100%;
    height: auto;
    max-height: 200px; /* Ensure the image fits inside the card */
    object-fit: cover;
  }
</style>
