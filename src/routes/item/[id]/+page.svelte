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
    <div class="left table-container max-h-screen overflow-y-auto">
      <table class="table table-hover w-full table-auto text-sm">
        <tbody>
          <tr>
            <td class="py-2 font-semibold text-center">Image:</td>
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
            <td class="py-2 font-semibold text-center">Caption (Italian):</td>
            <td class="py-2 text-center">{data.item.caption}</td>
          </tr>
          <tr>
            <td class="py-2 font-semibold text-center">Caption (English):</td>
            <td class="py-2 text-center">{data.item.caption_en}</td>
          </tr>
          <tr>
            <td class="py-2 font-semibold text-center">Volume:</td>
            <td class="py-2 text-center">{data.item.volume}</td>
          </tr>
          <tr>
            <td class="py-2 font-semibold text-center">Page Number:</td>
            <td class="py-2 text-center">{data.item.page}</td>
          </tr>
          <tr>
            <td class="py-2 font-semibold text-center">Regio:</td>
            <td class="py-2 text-center">
              {romanNumerals[data.item.location.regio]} ({data.item.location.regio})
            </td>
          </tr>
          <tr>
            <td class="py-2 font-semibold text-center">Insula:</td>
            <td class="py-2 text-center">{data.item.location.insula}</td>
          </tr>
          <tr>
            <td class="py-2 font-semibold text-center">Property:</td>
            <td class="py-2 text-center">{data.item.location.property}</td>
          </tr>
          <tr>
            <td class="py-2 font-semibold text-center">Room:</td>
            <td class="py-2 text-center">{data.item.location.room || 'N/A'}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Right Column: Map -->
    <div class="right max-h-screen overflow-y-auto">
      {#if data.item.location.geojson}
        <Map geojson={data.item.location.geojson} {center} zoom={18} />
        <!-- Legend -->
        <div class="mt-4 p-4 bg-white border rounded shadow">
          <h4 class="font-semibold">Legend:</h4>
          <ul>
            <li><span class="inline-block w-4 h-4 bg-blue-500 mr-2"></span>Regio</li>
            <li><span class="inline-block w-4 h-4 bg-green-500 mr-2"></span>Insula</li>
            <li><span class="inline-block w-4 h-4 bg-yellow-500 mr-2"></span>Property</li>
            <li><span class="inline-block w-4 h-4 bg-red-500 mr-2"></span>Room</li>
          </ul>
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
      <a class="card variant-ghost-primary card-hover block h-[600px] p-4" href={`/item/${similarImage.id}`}>
        <header class="flex h-1/2 justify-center">
          <img
            class="h-full bg-transparent object-contain"
            src={similarImage.imageURL}
            alt={similarImage.id}
          />
        </header>
        <div class="flex h-1/2 flex-col space-y-4 p-4">
          <h6 class="font-bold">
            Volume {similarImage.volume}, Page {similarImage.page},
            <i>
              Regio {romanNumerals[similarImage.location.regio]}, Insula {similarImage.location
                .insula}
            </i>
          </h6>
          <article class="flex-grow overflow-y-auto">
            {similarImage.caption_en}
          </article>
        </div>
      </a>
    {/each}
  </div>
</main>
