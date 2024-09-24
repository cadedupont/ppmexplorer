import { json } from '@sveltejs/kit';
import { env } from '$lib/env';
import { CosmosClient } from '@azure/cosmos';
import { AzureOpenAI } from 'openai';

const cosmosClient = new CosmosClient({
  endpoint: env.COSMOS_DB_ENDPOINT,
  key: env.COSMOS_DB_KEY
});
const openaiClient = new AzureOpenAI({
  endpoint: env.AZURE_OPENAI_ENDPOINT,
  deployment: env.AZURE_OPENAI_DEPLOYMENT
});

const generateEmbedding = async (query: string): Promise<number[]> => {
  const response = await openaiClient.embeddings.create({
    model: 'text-embedding-ada-002',
    input: query
  });
  return response.data[0].embedding;
};

export const POST = async ({ request }) => {
  try {
    const { query, numResults } = await request.json();
    const embedding = await generateEmbedding(query);
    const container = cosmosClient.database('ppmx').container('test');
    const { resources } = await container.items
      .query({
        query:
          'SELECT TOP @numResults c.id, c.imageURL, c.caption, c.volume, c.page, c.regio, c.insula, c.room, c.doorway FROM c ORDER BY VectorDistance(c.captionVector, @embedding)',
        parameters: [
          { name: '@embedding', value: embedding },
          { name: '@numResults', value: parseInt(numResults, 10) }
        ]
      })
      .fetchAll();
    console.log(resources);
    return json({ results: resources });
  } catch (error: any) {
    console.error('Error:', error.message);
    return json({ error: error.message }, { status: 500 });
  }
};
