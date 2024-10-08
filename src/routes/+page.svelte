<script lang="ts">
  import Card from '@smui/card';

  import Map from '$lib/components/Map.svelte';
  import type { PPMItem } from '$lib/types';
  import { romanNumerals } from '$lib/helpers';

  let items: PPMItem[] = [];
  let query: string;
  let vectorType: string = 'imageVector';
  let errorMessage: string;
  let numResults: number = 5; // Default value for number of results
  let geojson: GeoJSON.GeometryCollection = {
    type: 'GeometryCollection',
    geometries: []
  };

  const search = async () => {
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query, numResults, vectorType })
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();

      if (data.items.length === 0) {
        errorMessage = 'No items found. Please try again.';
      } else {
        errorMessage = '';
        geojson.geometries = [];
        items = data.items;
        items.forEach((item) => {
          if (item.location.geojson) {
            geojson.geometries.push(...item.location.geojson.geometries);
          }
        });
        geojson.geometries = geojson.geometries.filter((geometry) => geometry.type !== 'Point');
      }
    } catch (error) {
      errorMessage = 'Failed to fetch search items. Please try again.';
    }
  };
</script>

<main class="container">
  <div class="items-container">
    <div class="search-container">
      <select id="vector-type" bind:value={vectorType} class="filter-select">
        <option value="imageVector">Image</option>
        <option value="captionVector">Caption</option>
      </select>
      <select bind:value={numResults} class="result-select">
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="50">50</option>
        <option value="100">100</option>
      </select>
      <input type="text" bind:value={query} placeholder="Enter search query" class="search-input" />
      <button on:click={search} class="search-button">Search</button>
    </div>
    {#if errorMessage}
      <div class="error-message">{errorMessage}</div>
    {/if}
    <div class="scrollable-items">
      {#each items as item}
        <div class="card-container">
          <a href={`/item/${item.id}`}>
            <Card>
              <div style="text-align: center;">
                <p>
                  Volume {item.volume}, Page {item.page},
                  <i>
                    Regio {romanNumerals[item.location.regio]}, Insula {item.location.insula}
                  </i>
                </p>
              </div>
              <div class="image-container">
                <img class="card-image" src={item.imageURL} alt={item.id} />
              </div>
              <div class="caption-container">
                <p>{item.caption_en}</p>
              </div>
            </Card>
          </a>
        </div>
      {/each}
    </div>
  </div>
  <div class="map-container">
    <Map {geojson} center={undefined} />
  </div>
</main>

<style>
  .container {
    display: flex;
    height: 100vh;
  }

  .items-container {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
    border-right: 1px solid #ddd;
  }

  .search-container {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
    background-color: #8e8e8e; /* Light background for the search bar */
    border-radius: 8px; /* Rounded corners */
    padding: 10px; /* Padding around the search elements */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Subtle shadow */
  }

  .filter-select, .result-select, .search-input, .search-button {
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 8px 12px;
    font-size: 16px;
  }

  .filter-select, .result-select {
    background-color: #ffffff; /* background for dropdowns */
  }

  .search-input {
    flex: 1; /* Take remaining space */
    border: 1px solid #ccc;
  }

  .search-button {
    background-color: #000000; /* Bootstrap primary color BLACK  */
    color: white;
    border: none;
    cursor: pointer;
  }

  .search-button:hover {
    background-color: #747b82; /* Darker shade on hover the "SEARCH" */
  }

  .scrollable-items {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .card-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-decoration: none;
    color: inherit;
    width: 100%;
  }

  .card-container a {
    text-decoration: none;
    color: inherit;
    width: 100%;
  }

  .image-container {
    width: 100%;
    height: 300px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .error-message {
    color: red;
    margin-bottom: 20px;
  }

  .card-image {
    width: 100%;
    height: 100%;
    object-fit: contain;
    pointer-events: none;
  }

  .caption-container {
    padding: 8px;
    overflow: auto;
  }

  /* Right side (Map) */
  .map-container {
    flex: 2;
    height: 100vh;
    padding: 20px;
    overflow: hidden;
  }
</style>
