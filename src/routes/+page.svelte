<script lang="ts">
  let query = '';
  let results = [];

  const search = async () => {
    const response = await fetch('/api/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });
    const data = await response.json();
    results = data.results;
  }
</script>

<main>
  <h1>Search Embeddings</h1>
  <input type="text" bind:value={query} placeholder="Enter search query" />
  <button on:click={search}>Search</button>

  {#if results.length > 0}
    <ul>
      {#each results as result}
        <li>{result.id}</li>
      {/each}
    </ul>
  {/if}
</main>
