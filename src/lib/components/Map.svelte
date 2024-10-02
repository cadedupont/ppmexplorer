<script lang="ts">
  import { MapLibre, GeoJSON, FillLayer, LineLayer, DefaultMarker } from 'svelte-maplibre';
  import { centroid } from '@turf/centroid';

  export let geojson: GeoJSON.Feature<GeoJSON.Polygon>;
  const center = centroid(geojson).geometry.coordinates as [number, number];
</script>

<MapLibre
  style="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
  {center}
  zoom={18}
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
  <DefaultMarker lngLat={center} />
</MapLibre>

<style>
  :global(.map) {
    height: 100vh;
  }
</style>
