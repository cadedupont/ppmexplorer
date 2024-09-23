import { CosmosClient } from '@azure/cosmos';
import { AzureOpenAI } from 'openai';
import { json } from '@sveltejs/kit';
import { env } from '$lib/env';

const cosmosClient = new CosmosClient({
  endpoint: env.COSMOS_DB_ENDPOINT,
  key: env.COSMOS_DB_KEY
});
const openaiClient = new AzureOpenAI({
  endpoint: env.AZURE_OPENAI_ENDPOINT,
  deployment: env.AZURE_OPENAI_DEPLOYMENT,
  apiVersion: '2024-07-01-preview'
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
    const { query } = await request.json();
    const embedding = await generateEmbedding(query);
    const container = cosmosClient.database('ppmx').container('sample');

    const { resources } = await container.items
      .query({
        query: 'SELECT * FROM c WHERE ST_DISTANCE(c.embedding, @embedding) < @threshold',
        parameters: [
          { name: '@embedding', value: embedding },
          { name: '@threshold', value: 0.1 }
        ]
      })
      .fetchAll();
    return json({ results: resources });
  } catch (error) {
    console.error('Error:', error.message);
    return json({ error: error.message }, { status: 500 });
  }
};
