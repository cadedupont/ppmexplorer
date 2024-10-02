<script lang="ts">
  import {
    MapLibre,
    GeoJSON,
    FillLayer,
    LineLayer,
    DefaultMarker,
  } from 'svelte-maplibre';
  import type { LngLatLike } from 'svelte-maplibre';

  export let geojson: GeoJSON.GeometryCollection;
  const polygon: GeoJSON.Geometry = geojson.geometries[0];
  const centerPoint = geojson.geometries[1] as GeoJSON.Point;
  const centroid: LngLatLike = centerPoint.coordinates as [number, number];
</script>

<MapLibre
  style="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
  center={centroid}
  zoom={18}
  class="map"
  standardControls
>
  <GeoJSON data={polygon}>
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
  <DefaultMarker lngLat={centroid} />
</MapLibre>

<style>
  :global(.map) {
    height: 100vh;
  }
</style>
