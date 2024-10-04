<script lang="ts">
  import Card from '@smui/card';

  import Map from '$lib/components/Map.svelte';
  import { romanNumerals } from '$lib/helpers';
  import type { PPMItem } from '$lib/types';

  export let data: {
    item: PPMItem;
    similarItems: PPMItem[];
  };
</script>

<main class="container">
  <div class="top">
    <div class="left">
      <table>
        <tr>
          <td>Image:</td>
          <td>
            <img
              src={data.item.imageURL}
              alt={`${data.item.id}'s Image'`}
              class="contained-image"
            />
          </td>
        </tr>
        <tr>
          <td>Caption:</td>
          <td>{data.item.caption}</td>
        </tr>
        <tr>
          <td>Volume:</td>
          <td>{data.item.volume}</td>
        </tr>
        <tr>
          <td>Page Number:</td>
          <td>{data.item.page}</td>
        </tr>
        <tr>
          <td>Regio:</td>
          <td>{romanNumerals[data.item.location.regio]}</td>
        </tr>
        <tr>
          <td>Insula:</td>
          <td>{data.item.location.insula}</td>
        </tr>
        <tr>
          <td>Property:</td>
          <td>{data.item.location.property}</td>
        </tr>
      </table>
    </div>
    <div class="right">
      {#if data.item.location.geojson}
        <div class="map-container">
          <Map
            geojson={data.item.location.geojson}
            center={data.item.location.geojson.geometries[1].coordinates}
          />
        </div>
      {:else}
        <p style="color: red;">No map data available for this item.</p>
      {/if}
    </div>
  </div>
  <h3>Similar Images:</h3>
  <div class="bottom">
    <div class="grid-container">
      {#each data.similarItems as similarItem}
        <div class="card-container">
          <a href={`/item/${similarItem.id}`}>
            <Card>
              <div class="title-container">
                <p>
                  Volume {similarItem.volume}, Page {similarItem.page},
                  <i>
                    Regio {romanNumerals[similarItem.location.regio]},
                    Insula {similarItem.location.insula}
                  </i>
                </p>
              </div>
              <div class="image-container">
                <img class="card-image" src={similarItem.imageURL} alt={similarItem.id} />
              </div>
              <div class="caption-container">
                <p>{similarItem.caption}</p>
              </div>
            </Card>
          </a>
        </div>
      {/each}
    </div>
  </div>
</main>

<style>
  .container {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .top {
    display: flex;
    justify-content: space-between;
  }

  .left,
  .right {
    flex: 1;
    margin: 0 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 50%;
  }

  .contained-image {
    width: 100%;
    height: auto;
    object-fit: contain;
    max-height: 420px;
  }

  .map-container {
    width: 100%;
    padding: 20px;
    overflow: hidden;
  }

  table {
    height: 100vh;
    max-height: 100vh;
    border-collapse: collapse;
    margin-top: 20px;
  }

  td {
    padding: 8px;
    border: 1px solid #ddd;
    text-align: center;
    vertical-align: middle;
  }

  td:first-child {
    font-weight: bold;
  }

  .bottom {
    display: flex;
    justify-content: center;
  }

  .grid-container {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 20px;
  }

  .card-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-decoration: none;
    color: inherit;
  }

  .card-container a {
    text-decoration: none;
    color: inherit;
  }

  .title-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-grow: 1;
    padding: 8px;
    text-align: center;
  }

  .image-container {
    height: 300px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .card-image {
    width: 100%;
    height: 100%;
    object-fit: contain; /* Ensure the image fits within the card */
    pointer-events: none;
  }

  .caption-container {
    height: 100px;
    overflow: auto;
    padding: 8px;
  }
</style>
