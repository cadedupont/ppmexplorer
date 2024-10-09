<script lang="ts">
  import Map from '$lib/components/Map.svelte';
  import { romanNumerals } from '$lib/helpers';

  import type { PPMItem } from '$lib/types';
  import type { LngLatLike } from 'maplibre-gl';

  export let data: {
    item: PPMItem;
    similarImages: PPMItem[];
    similarCaptions: PPMItem[];
  };

  let center: LngLatLike = [0, 0];
  $: {
    const features = [...data.item.location.geojson.features].reverse();
    for (const feature of features) {
      if (feature) {
        center = feature.properties.centroid;
        break;
      }
    }
  }
</script>

<main class="container mx-auto p-6">
  <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
    <!-- Left Column: Item Details -->
    <div class="left table-container">
      <table
        class="table table-hover w-full table-auto border-separate rounded border border-primary-500 text-sm"
      >
        <tbody>
          <tr>
            <td class="py-2 text-center font-semibold">Image:</td>
            <td class="py-2">
              <div class="relative h-96 w-full">
                <img
                  src={data.item.imageURL}
                  alt={`${data.item.id}'s Image`}
                  class="h-full w-full object-contain"
                />
              </div>
            </td>
          </tr>
          <tr>
            <td class="py-2 text-center font-semibold">Caption (Italian):</td>
            <td class="py-2 text-center">{data.item.caption}</td>
          </tr>
          <tr>
            <td class="py-2 text-center font-semibold">Caption (English):</td>
            <td class="py-2 text-center">{data.item.caption_en}</td>
          </tr>
          <tr>
            <td class="py-2 text-center font-semibold">Volume:</td>
            <td class="py-2 text-center">{data.item.volume}</td>
          </tr>
          <tr>
            <td class="py-2 text-center font-semibold">Page Number:</td>
            <td class="py-2 text-center">{data.item.page}</td>
          </tr>
          <tr>
            <td class="py-2 text-center font-semibold">Regio:</td>
            <td class="py-2 text-center">
              {romanNumerals[data.item.location.regio]} ({data.item.location.regio})
            </td>
          </tr>
          <tr>
            <td class="py-2 text-center font-semibold">Insula:</td>
            <td class="py-2 text-center">{data.item.location.insula}</td>
          </tr>
          <tr>
            <td class="py-2 text-center font-semibold">Property:</td>
            <td class="py-2 text-center">{data.item.location.property}</td>
          </tr>
          <tr>
            <td class="py-2 text-center font-semibold">Room:</td>
            <td class="py-2 text-center">{data.item.location.room || 'N/A'}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Right Column: Map -->
    <div class="right">
      {#if data.item.location.geojson}
        <div class="flex h-full flex-col">
          <!-- Map should fill the remaining space -->
          <div class="flex-grow">
            <Map geojson={data.item.location.geojson} {center} zoom={18} />
          </div>
          <!-- Legend and note -->
          <div class="bg-primary mt-4 rounded border border-primary-500 p-4 shadow">
            <h4 class="font-semibold">Legend:</h4>
            <ul>
              <li><span class="mr-2 inline-block h-4 w-4 bg-blue-500"></span>Regio</li>
              <li><span class="mr-2 inline-block h-4 w-4 bg-green-500"></span>Insula</li>
              <li><span class="mr-2 inline-block h-4 w-4 bg-yellow-500"></span>Property</li>
              <li><span class="mr-2 inline-block h-4 w-4 bg-red-500"></span>Room</li>
            </ul>
            <p class="mt-2 text-sm text-primary-600">
              Note: Some map data may be unavailable for certain items.
            </p>
          </div>
        </div>
      {:else}
        <p class="text-red-600">No map data available for this item.</p>
      {/if}
    </div>
  </div>

  <!-- Similar Images Section -->
  <h3 class="mt-8 text-2xl font-semibold">Similar Images:</h3>
  <div class="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
    {#each data.similarImages as similarImage}
      <a
        class="card variant-ghost-tertiary card-hover block h-[600px] p-4"
        href={`/item/${similarImage.id}`}
      >
        <header class="flex h-1/2 justify-center">
          <img
            class="h-full bg-transparent object-contain"
            src={similarImage.imageURL}
            alt={similarImage.id}
          />
        </header>
        <div class="flex h-1/2 flex-col space-y-4 p-4">
          <h6 class="font-bold">
            Volume {similarImage.volume}, Page {similarImage.page}
            (Image {similarImage.id.split('_')[5]})
          </h6>
          <article class="flex-grow overflow-y-auto">
            {similarImage.caption_en}
          </article>
          <footer class="text-sm text-primary-600">
            <i>
              Regio {romanNumerals[similarImage.location.regio]}, Insula {similarImage.location
                .insula}, Property {similarImage.location.property}, Room {similarImage.location
                .room || 'N/A'}
            </i>
          </footer>
        </div>
      </a>
    {/each}
  </div>

  <!-- Similar Captions Section -->
  <h3 class="mt-8 text-2xl font-semibold">Similar Captions:</h3>
  <div class="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
    {#each data.similarCaptions as similarCaption}
      <a
        class="card variant-ghost-secondary card-hover block h-[600px] p-4"
        href={`/item/${similarCaption.id}`}
      >
        <header class="flex h-1/2 justify-center">
          <img
            class="h-full bg-transparent object-contain"
            src={similarCaption.imageURL}
            alt={similarCaption.id}
          />
        </header>
        <div class="flex h-1/2 flex-col space-y-4 p-4">
          <h6 class="font-bold">
            Volume {similarCaption.volume}, Page {similarCaption.page}
            (Image {similarCaption.id.split('_')[5]})
          </h6>
          <article class="flex-grow overflow-y-auto">
            {similarCaption.caption_en}
          </article>
          <footer class="text-sm text-primary-600">
            <i>
              Regio {romanNumerals[similarCaption.location.regio]}, Insula {similarCaption.location
                .insula}, Property {similarCaption.location.property}, Room {similarCaption.location
                .room || 'N/A'}
            </i>
          </footer>
        </div>
      </a>
    {/each}
  </div>
</main>
