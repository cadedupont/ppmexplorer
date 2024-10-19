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
  let itemsLoading: boolean = false;
  let genaiResponse: string = '';
  let llmResponseLoading: boolean = false;

  const search = async () => {
    itemsLoading = true;
    llmResponseLoading = true;
    genaiResponse = '';
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
      items = data.items;

      if (items.length === 0) {
        throw new Error('No items found');
      }

      errorMessage = '';
      geojson.features = [];
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

      fetchLLMResponse();

    } catch (err) {
      console.error(err);
      errorMessage = 'Failed to fetch search items. Please try again.';
    } finally {
      itemsLoading = false;
    }
  };

  const fetchLLMResponse = async () => {
    try {
      const llmResponse = await fetch('/api/llm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query, items })
      });
      if (!llmResponse.ok) {
        throw new Error('Network response was not ok');
      }
      const llmData = await llmResponse.json();
      genaiResponse = llmData.llmResponse;
    } catch (err) {
      console.error(err);
      errorMessage = 'Failed to fetch LLM response. Please try again.';
    } finally {
      llmResponseLoading = false;
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
          class="flex-3 input mb-2 block h-[40px] w-full p-2 p-4"
          type="text"
          bind:value={query}
          placeholder="Enter search query"
          on:keydown={(event) => {
            if (event.key === 'Enter') search();
          }}
        />
        <button
          type="button"
          class="variant-filled-secondary btn h-[40px] flex-1 text-white"
          data-sveltekit-preload-data="hover"
          on:click={search}>Search</button
        >
      </div>
      {#if errorMessage}
        <div class="mb-5 text-red-500">{errorMessage}</div>
      {/if}
      <div class="space-y-4">
        {#if itemsLoading}
          <div class="flex h-full items-center justify-center">
            <svg
              aria-hidden="true"
              class="h-8 w-8 animate-spin fill-secondary-500 text-gray-500 dark:text-gray-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span class="sr-only">Loading...</span>
          </div>
        {:else}
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
                <footer class="currentColor text-sm">
                  <i>
                    Regio {romanNumerals[item.location.regio]}, Insula {item.location.insula},
                    Property {item.location.property}, Room {item.location.room || 'N/A'}
                  </i>
                </footer>
              </div>
            </a>
          {/each}
        {/if}
      </div>
    </div>
    <div class="col-span-2 flex flex-col p-5">
      <SlideToggle
      name="slider-medium"
      bind:checked={showRegios}
      active="bg-secondary-500"
      size="sm"
      >
      Show Regios
      </SlideToggle>
      <div class="flex-1 mt-4">
      <Map {geojson} center={[14.4884, 40.75103]} zoom={15} showMarker {showRegios} />
      </div>
      <div class="relative mt-4 h-[30%]">
        {#if llmResponseLoading}
          <div class="absolute inset-0 flex items-center justify-center">
            <svg
              aria-hidden="true"
              class="h-8 w-8 animate-spin fill-tertiary-500 text-gray-500 dark:text-gray-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span class="sr-only">Loading...</span>
          </div>
        {/if}
        <textarea class="textarea h-full w-full p-4" rows="4" bind:value={genaiResponse} readonly></textarea>
      </div>
    </div>
  </div>
</main>
