import { CosmosClient } from '@azure/cosmos';
import { env } from '$lib/env';
import { json } from '@sveltejs/kit';

export const GET = async ({ params }) => {
  const client = new CosmosClient({
    endpoint: String(env.COSMOS_DB_ENDPOINT),
    key: String(env.COSMOS_DB_KEY)
  });
  const container = client.database('ppmx').container('comp-vision-test');
  const { resources: records } = await container.items
    .query({
      query: `SELECT c.id, c.imageURL, c.caption, c.volume, c.page, c.location, c.imageVector FROM c WHERE c.id = @recordID`,
      parameters: [{ name: '@recordID', value: params.record }]
    })
    .fetchAll();

  if (records.length === 0) {
    return json({ error: 'Record not found', status: 404 });
  }
  const record = records[0];

  const { resources: similarItems } = await container.items
    .query({
      query: `SELECT c.id, c.imageURL, c.caption, c.volume, c.page, c.location, VectorDistance(c.imageVector, @embedding) AS imageDistance FROM c`,
      parameters: [{ name: '@embedding', value: record.imageVector }]
    })
    .fetchAll();

  const geojson = await Promise.all(
    [
      `r${record.location.regio}`,
      `r${record.location.regio}-i${record.location.insula}`,
      `r${record.location.regio}-i${record.location.insula}-p${record.location.property}`
    ].map((endpoint) =>
      fetch(`https://api.p-lod.org/geojson/${endpoint}`).then((response) => response.json())
    )
  );
  record.geojson = {
    type: 'FeatureCollection',
    features: geojson
  };
  record.similarItems = similarItems.sort((a, b) => b.imageDistance - a.imageDistance).slice(1, 11);
  return json({ record });
};
