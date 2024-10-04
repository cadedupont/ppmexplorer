<script lang="ts">
  import Card from '@smui/card';

  import Map from '$lib/components/Map.svelte';
  import type { PPMItem } from '$lib/types';
  import { romanNumerals } from '$lib/helpers';

  let items: PPMItem[] = [];
  let query: string;
  let vectorType: string;
  let errorMessage: string;
  let numResults: number;
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
        geojson.geometries.filter((geometry) => geometry.type !== 'Point');
      }
    } catch (error) {
      errorMessage = 'Failed to fetch search items. Please try again.';
    }
    geojson.geometries.filter((geometry) => geometry.type !== 'Point');
  };
</script>

<main class="container">
  <div class="items-container">
    <div class="search-container">
      <select id="vector-type" bind:value={vectorType}>
        <option value="imageVector" selected>Image</option>
        <option value="captionVector">Caption</option>
      </select>
      <select bind:value={numResults}>
        <option value="5" selected>5</option>
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="50">50</option>
        <option value="100">100</option>
      </select>
      <input type="text" bind:value={query} placeholder="Enter search query" />
      <button on:click={search}>Search</button>
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
                <p>{item.caption}</p>
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

  .search-container {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
  }
</style>
