<script lang="ts">
  import Card from '@smui/card';

  export let data;
</script>

<div class="card-container">
  {#each data.images as image}
    <div class="card">
      <Card>
        <img src={image.id} alt="test" />
        <embed src={image.caption} />
      </Card>
    </div>
  {/each}
</div>

<style>
  .card-container {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    justify-items: center;
  }

  .card {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 400px;
    height: 700px;
  }

  .card img {
    width: 100%;
    height: auto;
    max-height: 400px;
    object-fit: contain;
  }
</style>