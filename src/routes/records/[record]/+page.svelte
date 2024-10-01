<script lang="ts">
  export let data: any;
</script>

<h1>ID: {data.record.id}</h1>
<img src={`${data.record.imageURL}${data.blobSasToken}`} alt={`${data.record.id}'s Image'`} />
<p>Caption: {data.record.caption}</p>
<p>Volume: {data.record.volume}</p>
<p>Page Number: {data.record.page}</p>
<p>Regio: {data.record.location.regio}</p>
<p>Insula: {data.record.location.insula}</p>
<p>Property: {data.record.location.property}</p>
