<script lang="ts">
  import {
    MapLibre,
    GeoJSON,
    FillLayer,
    LineLayer,
    RasterTileSource,
    RasterLayer
  } from 'svelte-maplibre';

  import type { LngLatLike } from 'maplibre-gl';
  import type { PPMGeoJSONFeatureCollection } from '$lib/types';

  export let geojson: PPMGeoJSONFeatureCollection;
  export let center: LngLatLike;
  export let zoom: number;
</script>

<MapLibre
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
  {#each geojson.features as feature}
    {#if feature}
      <GeoJSON data={feature}>
        <FillLayer
          paint={{
            'fill-color': feature.properties.color,
            'fill-opacity': 0.25
          }}
        />
        <LineLayer
          paint={{
            'line-color': feature.properties.color,
            'line-width': 1
          }}
        />
      </GeoJSON>
    {/if}
  {/each}
</MapLibre>

<style>
  :global(.map) {
    height: 100vh;
  }
</style>
