<script lang="ts">
  import { onMount } from 'svelte';
  import {
    MapLibre,
    GeoJSON,
    FillLayer,
    LineLayer,
    DefaultMarker,
    Popup,
    RasterTileSource,
    RasterLayer
  } from 'svelte-maplibre';
  import type { LngLatLike } from 'maplibre-gl';

  import { urnToTitle, regios } from '$lib/helpers';
  import type { PPMGeoJSONFeatureCollection } from '$lib/types';

  export let geojson: PPMGeoJSONFeatureCollection;
  export let center: LngLatLike;
  export let zoom: number;
  export let showMarker: boolean = false;
  export let showRegios: boolean = false;

  let map: any;
  const resize = () => {
    if (map) {
      map.resize();
      map.setCenter(center);
    }
  };
  onMount(() => {
    resize();
  });
</script>

<MapLibre
  bind:this={map}
  on:resize={resize}
  style="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
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
          'fill-color': 'blue',
          'fill-opacity': 0.1
        }}
      />
      <LineLayer
        paint={{
          'line-color': 'blue',
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
            'fill-color': feature.properties.color,
            'fill-opacity': 0.25 * (showMarker ? feature.properties.ppmItemIDs.length : 1)
          }}
        />
        <LineLayer
          paint={{
            'line-color': feature.properties.color,
            'line-width': 1
          }}
        />
        {#if showMarker}
          <DefaultMarker lngLat={feature.properties.centroid}>
            <Popup offset={[0, -10]}>
              <div class="mb-2 text-lg font-bold">{urnToTitle(feature.properties.title)}</div>
              <ul class="list-inside list-disc space-y-1">
                {#each feature.properties.ppmItemIDs as itemID}
                  <li class="text-sm">
                    <a href={`/item/${itemID}`} class="text-blue-500 hover:text-blue-700">
                      {itemID}
                    </a>
                  </li>
                {/each}
              </ul>
            </Popup>
          </DefaultMarker>
        {/if}
      </GeoJSON>
    {/if}
  {/each}
</MapLibre>

<style>
  :global(.map) {
    height: 100%;
    width: 100%;
  }
</style>
