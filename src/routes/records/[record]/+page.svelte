<script lang="ts">
  import Map from '$lib/components/Map.svelte';
  import Card from '@smui/card';

  const roman_numerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'];

  export let data: any;
</script>

<img src={`${data.record.imageURL}${data.blobSasToken}`} alt={`${data.record.id}'s Image'`} />
<p>Caption: {data.record.caption}</p>
<p>Volume: {data.record.volume}</p>
<p>Page Number: {data.record.page}</p>
<p>Regio: {data.record.location.regio}</p>
<p>Insula: {data.record.location.insula}</p>
<p>Property: {data.record.location.property}</p>

<h2>Similar Items:</h2>
<div class="grid-container">
  {#each data.record.similarItems as result}
    <a class="card-container" href={`/records/${result.id}`}>
      <Card>
        <div class="text-container">
          <p>
            Volume {result.volume}, Page {result.page},
            <i>
              Regio {roman_numerals[result.location.regio - 1]}, Insula {result.location.insula}
            </i>
          </p>
        </div>
        <div class="image-container">
          <img
            class="card-image"
            src={`${result.imageURL}${data.blobSasToken}`}
            alt={result.id}
          />
        </div>
        <div class="caption-container">
          <p>{result.caption}</p>
        </div>
      </Card>
    </a>
  {/each}
</div>

<Map geojson={data.record.geojson} />

<style>
  .grid-container {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 20px;
  }

  .card-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    text-decoration: none;
    color: inherit;
  }

  .text-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-grow: 1;
    text-align: center;
  }

  .image-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 300px;
    overflow: hidden;
  }

  .card-image {
    width: 100%;
    height: auto;
    object-fit: contain;
    pointer-events: none;
  }

  .caption-container {
    height: 100px;
    overflow: auto;
    padding: 8px;
  }
</style>