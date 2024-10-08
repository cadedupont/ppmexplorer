<script lang="ts">
import Map from '$lib/components/Map.svelte';
  import { romanNumerals } from '$lib/helpers';

  import type { PPMGeoJSONFeatureCollection, PPMItem } from '$lib/types';

  let items: PPMItem[] = [];
  let query: string;
  let vectorType: string;
  let errorMessage: string;
  let numResults: number;
  let geojson: PPMGeoJSONFeatureCollection = { type: 'FeatureCollection', features: [] };

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
        geojson.features = [];
        items = data.items;
        items.forEach((item) => {
          const property = item.location.geojson.features[2];
          const room = item.location.geojson.features[3];
          if (property) {
            geojson.features.push(property);
          }
          if (room) {
            geojson.features.push(room);
          }
        });
      }
    } catch (err) {
      errorMessage = 'Failed to fetch search items. Please try again.';
    }
  };
</script>

<main class="grid grid-cols-3 h-screen">
  <div class="col-span-1 p-5 overflow-y-auto border-r border-gray-300">
    <div class="mb-5 flex space-x-4">
      <label class="block mb-2 flex-1">
        <span>Vector Type</span>
        <select class="select block w-full mt-1" bind:value={vectorType}>
          <option value="imageVector" selected>Image</option>
          <option value="captionVector">Caption</option>
        </select>
      </label>
      <label class="block mb-2 flex-1">
        <span>Number of Results</span>
        <select class="select block w-full mt-1" bind:value={numResults}>
          <option value="5" selected>5</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </label>
    </div>
    <div class="mb-5 flex space-x-4">
      <input class="input p-4block w-full p-2 mb-2 flex-3" type="text" bind:value={query} placeholder="Enter search query" />
      <button
      type="button"
      class="btn variant-filled-primary flex-1"
      data-sveltekit-preload-data="hover"
      on:click={search}>Search</button>
    </div>
    {#if errorMessage}
      <div class="text-red-500 mb-5">{errorMessage}</div>
    {/if}
    <div class="space-y-4">
      {#each items as item}
        <a class="variant-ghost-primary card card-hover block p-4" href={`/item/${item.id}`}>
          <header>
            <img class="h-full bg-black/50 object-cover" src={item.imageURL} alt={item.id} />
          </header>
          <div class="space-y-4 p-4">
            <h6 class="font-bold">
              Volume {item.volume}, Page {item.page},
              <i>
                Regio {romanNumerals[item.location.regio]}, Insula {item.location.insula}
              </i>
            </h6>
            <article>{item.caption_en}</article>
          </div>
        </a>
      {/each}
    </div>
  </div>
  <div class="col-span-2 p-5">
    <Map {geojson} center={[14.4884, 40.75103]} zoom={15} />
  </div>
</main>