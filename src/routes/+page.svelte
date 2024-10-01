<script lang="ts">
  import Card from '@smui/card';
  import type { PPMRecord } from '$lib/types';

  export let data;
  let results: PPMRecord[] = [];
  let query: string = '';
  let numResults: number;
  let weight: number = 50;
  const roman_numerals: string[] = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'];

  const search = async () => {
    const response = await fetch('/api/cosmos-search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query, numResults, weight })
    });
    const data = await response.json();
    results = data.results;
  };
</script>

<main>
  <h1>PPMExplorer</h1>
  <div class="search-container">
    <select bind:value={numResults}>
      <option value="5" selected>5</option>
      <option value="10">10</option>
      <option value="20">20</option>
      <option value="50">50</option>
    </select>
    <input type="text" bind:value={query} placeholder="Enter search query" />
    <button on:click={search}>Search</button>
  </div>

  <div class="slider-container">
    <label for="weight-slider">Caption {100 - weight}%</label>
    <input type="range" id="weight-slider" min="0" max="100" bind:value={weight} />
    <label for="weight-slider">Image {weight}%</label>
  </div>

  {#if results.length > 0}
    <div class="grid-container">
      {#each results as result}
        <div class="card-container">
          <Card>
            <div class="text-container">
              <p>
                Volume {result.volume},
                <i
                  >Regio {roman_numerals[result.location.regio - 1]}, Insula {result.location
                    .insula}</i
                >
              </p>
            </div>
            <div class="image-container">
              <img
                class="card-image"
                src={`${result.imageURL}${data.blobSasToken}`}
                alt={result.id}
              />
            </div>
            <div class="caption-container">
              <p>{result.caption}</p>
            </div>
          </Card>
        </div>
      {/each}
    </div>
  {/if}
</main>

<style>
  .search-container {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
  }

  .slider-container {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
  }

  .grid-container {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 20px;
  }

  .card-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
  }

  .text-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-grow: 1;
    text-align: center;
  }

  .image-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 200px;
    overflow: hidden;
  }

  .card-image {
    width: 100%;
    height: auto;
    object-fit: cover;
    pointer-events: none;
  }

  .caption-container {
    height: 100px;
    overflow: auto;
    padding: 8px;
  }
</style>
