<script lang="ts">
  import { MapLibre, GeoJSON, FillLayer, LineLayer } from 'svelte-maplibre';

  export let geojson: GeoJSON.Feature;
</script>

<MapLibre
  style="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
  center={[14.4886, 40.751069]}
  zoom={15}
  class="map"
  standardControls
>
  <GeoJSON data={geojson}>
    <FillLayer
    paint={{
      'fill-color': '#088',
      'fill-opacity': 0.1
    }}
  />
  <LineLayer
    paint={{
      'line-color': '#000',
      'line-width': 1
    }}
  />
  </GeoJSON>
</MapLibre>

<style>
  :global(.map) {
    height: 100vh;
  }
</style>