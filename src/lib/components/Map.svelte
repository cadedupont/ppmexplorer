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
            'fill-opacity': 0.3 * (showMarker ? feature.properties.ppmItemIDs.length : 1)
          }}
        />
        <LineLayer
          paint={{
            'line-color': colorMap[feature.properties.color],
            'line-width': 3
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
                      Volume {parseInt(itemID.split('_')[1])}, Page {parseInt(itemID.split('_')[3])}
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
