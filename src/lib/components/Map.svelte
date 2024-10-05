<script lang="ts">
  import {
    MapLibre,
    GeoJSON,
    FillLayer,
    LineLayer,
    RasterTileSource,
    RasterLayer
  } from 'svelte-maplibre';

  export let geojson: GeoJSON.GeometryCollection;
  export let center: [number, number] | undefined;
</script>

<MapLibre
  style="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
  center={center ? center : [14.4884, 40.75103]}
  zoom={center ? 18 : 15}
  minZoom={15}
  maxZoom={18}
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
  {#each geojson.geometries as geometry}
    {#if geometry.type != 'Point'}
      <GeoJSON data={geometry}>
        <FillLayer
          paint={{
            'fill-color': 'blue',
            'fill-opacity': 0.25
          }}
        />
        <LineLayer
          paint={{
            'line-color': 'blue',
            'line-width': 1
          }}
        />
      </GeoJSON>
      <!-- {:else}
      <DefaultMarker lngLat={geometry.coordinates} /> -->
    {/if}
  {/each}
</MapLibre>

<style>
  :global(.map) {
    height: 100vh;
  }
</style>
