<script lang="ts">
  import { onMount } from 'svelte';
  import { modeCurrent } from '@skeletonlabs/skeleton';
  import { derived } from 'svelte/store';
  import {
    MapLibre,
    GeoJSON,
    FillLayer,
    LineLayer,
    Marker,
    Popup,
    RasterTileSource,
    RasterLayer
  } from 'svelte-maplibre';
  import type { LngLatLike } from 'maplibre-gl';
  import tailwindColors from 'tailwindcss/colors';

  import { urnToTitle, regios } from '$lib/helpers';
  import type { PPMGeoJSONFeatureCollection } from '$lib/types';

  export let geojson: PPMGeoJSONFeatureCollection;
  export let center: LngLatLike;
  export let zoom: number;
  export let showMarker: boolean = false;
  export let showRegios: boolean = false;

  const colorMap: { [key in 'blue' | 'green' | 'yellow' | 'red']: string } = {
    blue: tailwindColors.blue[500],
    green: tailwindColors.green[500],
    yellow: tailwindColors.yellow[500],
    red: tailwindColors.red[500]
  };

  const style = derived(modeCurrent, ($isDarkMode) =>
    $isDarkMode
      ? 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json'
      : 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'
  );

  let map: maplibregl.Map | undefined;
  const reset = () => {
    map?.resize();
    map?.setCenter(center);
    map?.setZoom(zoom);
  };
  onMount(() => {
    reset();
  });
</script>

<MapLibre
  bind:map
  on:resize={reset}
  style={$style}
  {center}
  {zoom}
  minZoom={15}
  maxZoom={20}
  class="map"
  standardControls
>
  <RasterTileSource tiles={['https://palp.art/xyz-tiles/{z}/{x}/{y}.png']} tileSize={256}>
    <RasterLayer
      paint={{
        'raster-opacity': 0.6
      }}
    />
  </RasterTileSource>

  {#if showRegios}
    <GeoJSON data={regios}>
      <FillLayer
        paint={{
          'fill-color': colorMap['blue'],
          'fill-opacity': 0.2
        }}
      />
      <LineLayer
        paint={{
          'line-color': colorMap['blue'],
          'line-width': 3
        }}
      />
    </GeoJSON>
  {/if}
  {#each geojson.features as feature}
    {#if feature}
      <GeoJSON data={feature}>
        <FillLayer
          paint={{
            'fill-color': colorMap[feature.properties.color],
            'fill-opacity': 0.2 * (showMarker ? feature.properties.ppmItemIDs.length : 1)
          }}
        />
        <LineLayer
          paint={{
            'line-color': colorMap[feature.properties.color],
            'line-width': 3
          }}
        />
        {#if showMarker}
          <Marker lngLat={feature.properties.centroid}>
            {#if feature.properties.ppmItemIDs.length === 1}
              <div class="rounded-full bg-primary-400 p-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="6 2 16 20">
                  <path
                    fill="currentColor"
                    d="M14 11.5A2.5 2.5 0 0 0 16.5 9A2.5 2.5 0 0 0 14 6.5A2.5 2.5 0 0 0 11.5 9a2.5 2.5 0 0 0 2.5 2.5M14 2c3.86 0 7 3.13 7 7c0 5.25-7 13-7 13S7 14.25 7 9a7 7 0 0 1 7-7"
                  />
                </svg>
              </div>
            {:else}
              <div class="rounded-full bg-primary-600 p-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M14 11.5A2.5 2.5 0 0 0 16.5 9A2.5 2.5 0 0 0 14 6.5A2.5 2.5 0 0 0 11.5 9a2.5 2.5 0 0 0 2.5 2.5M14 2c3.86 0 7 3.13 7 7c0 5.25-7 13-7 13S7 14.25 7 9a7 7 0 0 1 7-7M5 9c0 4.5 5.08 10.66 6 11.81L10 22S3 14.25 3 9c0-3.17 2.11-5.85 5-6.71C6.16 3.94 5 6.33 5 9Z"
                  />
                </svg>
              </div>
            {/if}
            <Popup offset={[0, -10]}>
              <div class="mb-2 text-lg font-bold text-primary-500">
                {urnToTitle(feature.properties.title)}
              </div>
              <ul class="list-inside list-disc space-y-1 text-tertiary-500">
                {#each feature.properties.ppmItemIDs as itemID}
                  <li class="text-sm">
                    <a href={`/item/${itemID}`} class="text-tertiary-600 hover:text-tertiary-700">
                      Volume {parseInt(itemID.split('_')[1])}, Page {parseInt(itemID.split('_')[3])}
                      (Image {parseInt(itemID.split('_')[5])})
                    </a>
                  </li>
                {/each}
              </ul>
            </Popup>
          </Marker>
        {/if}
      </GeoJSON>
    {/if}
  {/each}
</MapLibre>

<style>
  :global(.map) {
    height: 100%;
    width: 100%;
    font-family: inherit;
  }
</style>
