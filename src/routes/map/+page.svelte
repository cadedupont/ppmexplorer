<script lang="ts">
  import { MapLibre, GeoJSON, FillLayer, LineLayer } from 'svelte-maplibre';

  export let data: GeoJSON.FeatureCollection;
</script>

<MapLibre
  style="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
  center={[14.4886, 40.751069]}
  zoom={15}
  class="map"
  standardControls
>
  <GeoJSON {data}>
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
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 50%;
    height: 75%;
  }
</style>