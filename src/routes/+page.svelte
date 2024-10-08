<script lang="ts">
  import { SlideToggle } from '@skeletonlabs/skeleton';

  import Map from '$lib/components/Map.svelte';
  import { romanNumerals } from '$lib/helpers';

  import type { PPMGeoJSONFeatureCollection, PPMItem } from '$lib/types';

  let items: PPMItem[] = [];
  let query: string;
  let vectorType: string;
  let errorMessage: string;
  let numResults: number;
  let geojson: PPMGeoJSONFeatureCollection = { type: 'FeatureCollection', features: [] };
  let showRegios: boolean = true;

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
          const room = item.location.geojson.features[3];
          if (room) {
            const existingRoom = geojson.features.find(
              (feature) => feature.id === room.properties.title
            );
            if (existingRoom) {
              existingRoom.properties.ppmItemIDs.push(item.id);
            } else {
              geojson.features.push(room);
              room.properties.ppmItemIDs = [item.id];
            }
          }
        });
      }
    } catch (err) {
      console.error(err);
      errorMessage = 'Failed to fetch search items. Please try again.';
    }
  };
</script>

<main class="grid h-screen grid-cols-3">
  <div class="col-span-1 overflow-y-auto border-r border-gray-300 p-5">
    <div class="mb-5 flex space-x-4">
      <label class="mb-2 block flex-1">
        <span>Vector Type</span>
        <select class="select mt-1 block w-full" bind:value={vectorType}>
          <option value="imageVector" selected>Image</option>
          <option value="captionVector">Caption</option>
        </select>
      </label>
      <label class="mb-2 block flex-1">
        <span>Number of Results</span>
        <select class="select mt-1 block w-full" bind:value={numResults}>
          <option value="5" selected>5</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </label>
    </div>
    <div class="mb-5 flex space-x-4">
      <input
        class="p-4block flex-3 input mb-2 w-full p-2"
        type="text"
        bind:value={query}
        placeholder="Enter search query"
      />
      <button
        type="button"
        class="variant-filled-primary btn flex-1 text-white"
        data-sveltekit-preload-data="hover"
        on:click={search}>Search</button
      >
    </div>
    {#if errorMessage}
      <div class="mb-5 text-red-500">{errorMessage}</div>
    {/if}
    <div class="space-y-4">
      {#each items as item}
        <a class="card variant-ghost-primary card-hover block p-4" href={`/item/${item.id}`}>
          <header class="flex justify-center">
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
    <SlideToggle name="slider-medium" bind:checked={showRegios} active="bg-primary-500" size="med">
      Show Regios
    </SlideToggle>
    <Map {geojson} center={[14.4884, 40.75103]} zoom={15} showMarker {showRegios} />
  </div>
</main>
