<script lang="ts">
  import { MapLibre, GeoJSON, FillLayer, LineLayer, DefaultMarker } from 'svelte-maplibre';

  export let geojson: GeoJSON.GeometryCollection;
</script>

<MapLibre
  style="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
  center={[14.4886, 40.751069]}
  zoom={16}
  class="map"
  standardControls
>
  {#each geojson.geometries as geometry}
    {#if geometry.type != 'Point'}
      <GeoJSON data={geometry}>
        <FillLayer
          paint={{
            'fill-color': '#088',
            'fill-opacity': 0.3
          }}
        />
        <LineLayer
          paint={{
            'line-color': '#000',
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
