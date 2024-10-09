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
          if (!item.location.geojson) return;
          const room = item.location.geojson.features[3];
          if (room) {
            const existingRoom = geojson.features.find(
              (feature) => feature.id === room.properties.title
            );
            if (existingRoom) {
              existingRoom.properties.ppmItemIDs.push(item.id);
              existingRoom.properties.ppmItemIDs.sort();
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

<main class="container mx-auto p-6">
  <div class="grid h-screen grid-cols-3">
    <div class="col-span-1 overflow-y-auto border-r border-primary-500 p-5">
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
          class="flex-3 h-[40px] input mb-2 block w-full p-2 p-4"
          type="text"
          bind:value={query}
          placeholder="Enter search query"
          on:keydown={(event) => {
            if (event.key === 'Enter') search();
          }}
        />
        <button
          type="button"
          class="h-[40px] variant-filled-secondary btn flex-1 text-white"
          data-sveltekit-preload-data="hover"
          on:click={search}>Search</button
        >
      </div>
      {#if errorMessage}
        <div class="mb-5 text-red-500">{errorMessage}</div>
      {/if}
      <div class="space-y-4">
        {#each items as item}
          <a class="card variant-ghost-tertiary card-hover block p-4" href={`/item/${item.id}`}>
            <header class="flex justify-center">
              <img class="h-full bg-black/50 object-cover" src={item.imageURL} alt={item.id} />
            </header>
            <div class="space-y-4 p-4">
              <h6 class="font-bold">
                Volume {item.volume}, Page {item.page} (Image {item.id.split('_')[5]})
              </h6>
              <article>{item.caption_en}</article>
              <footer class="text-sm text-primary-600">
                <i>
                  Regio {romanNumerals[item.location.regio]}, Insula {item.location
                    .insula}, Property {item.location.property}, Room {item.location
                    .room || 'N/A'}
                </i>
              </footer>
            </div>
          </a>
        {/each}
      </div>
    </div>
    <div class="col-span-2 p-5">
      <SlideToggle
        name="slider-medium"
        bind:checked={showRegios}
        active="bg-secondary-500"
        size="sm"
      >
        Show Regios
      </SlideToggle>
      <Map {geojson} center={[14.4884, 40.75103]} zoom={15} showMarker {showRegios} />
    </div>
  </div>
</main>
