<script lang="ts">
  import Card from '@smui/card';

  import Map from '$lib/components/Map.svelte';
  import type { PPMRecord } from '$lib/types';
  import { romanNumerals } from '$lib/helpers';

  export let data;

  let results: PPMRecord[] = [];
  let query: string = '';
  let vectorType: string;
  let numResults: number;

  let geojson: GeoJSON.GeometryCollection = {
    type: 'GeometryCollection',
    geometries: []
  };

  const search = async () => {
    const response = await fetch('/api/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query, numResults, vectorType })
    });
    const data = await response.json();
    results = data.results;
    geojson = {
      type: 'GeometryCollection',
      geometries: results.flatMap((result) => result.location.geojson.geometries)
    };
  };
</script>

<main>
  <div class="search-container">
    <select bind:value={numResults}>
      <option value="5" selected>5</option>
      <option value="10">10</option>
      <option value="20">20</option>
      <option value="50">50</option>
    </select>
    <input type="text" bind:value={query} placeholder="Enter search query" />
    <button on:click={search}>Search</button>
    <label for="vector-type">Vector Type:</label>
    <select id="vector-type" bind:value={vectorType}>
      <option value="imageVector" selected>Image</option>
      <option value="captionVector">Caption</option>
    </select>
  </div>

  {#if results.length > 0}
    <div class="grid-container">
      {#each results as result}
        <a class="card-container" href={`/records/${result.id}`}>
          <Card>
            <div class="text-container">
              <p>
                Volume {result.volume}, Page {result.page},
                <i>
                  Regio {romanNumerals[result.location.regio]}, Insula {result.location.insula}
                </i>
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
        </a>
      {/each}
    </div>
    <Map {geojson} />
  {/if}
</main>

<style>
  .search-container {
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
    text-decoration: none;
    color: inherit;
  }

  .text-container {
    text-align: center;
  }

  .image-container {
    width: 100%;
    height: 300px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .card-image {
    width: 100%;
    height: auto;
    object-fit: contain;
    pointer-events: none;
  }

  .caption-container {
    height: 100px;
    overflow: auto;
    padding: 8px;
  }
</style>
