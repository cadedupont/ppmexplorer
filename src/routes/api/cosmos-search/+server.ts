import { json } from '@sveltejs/kit';
import { env } from '$lib/env';
import { CosmosClient } from '@azure/cosmos';
import { AzureOpenAI } from 'openai';

const generateOpenAIEmbedding = async (query: string): Promise<number[]> => {
  const client = new AzureOpenAI({
    endpoint: String(env.AZURE_OPENAI_ENDPOINT),
    deployment: String(env.AZURE_OPENAI_DEPLOYMENT)
  });
  const response = await client.embeddings.create({
    model: 'text-embedding-ada-002',
    input: query
  });
  return response.data[0].embedding;
};

const generateAIVisionEmbedding = async (query: string): Promise<number[]> => {
  const response = await fetch(
    `${env.AZURE_COMPUTER_VISION_ENDPOINT}computervision/retrieval:vectorizeText?api-version=2024-02-01&model-version=2023-04-15`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': String(env.AZURE_COMPUTER_VISION_KEY)
      },
      body: JSON.stringify({ text: query })
    }
  );
  const data = await response.json();
  return data.vector;
};

export const POST = async ({ request }) => {
  try {
    const { query, numResults, weight } = await request.json();

    const client = new CosmosClient({
      endpoint: String(env.COSMOS_DB_ENDPOINT),
      key: String(env.COSMOS_DB_KEY)
    });
    const container = client.database('ppmx').container('comp-vision-test');
    const embedding = await generateAIVisionEmbedding(query);

    const { resources } = await container.items
      .query({
        query: `SELECT c.id, c.imageURL, c.caption, c.volume, c.page, c.location, VectorDistance(c.imageVector, @embedding) AS imageDistance, VectorDistance(c.captionVector, @embedding) AS captionDistance FROM c`,
        parameters: [
          { name: '@numResults', value: parseInt(numResults, 10) },
          { name: '@embedding', value: embedding }
        ]
      })
      .fetchAll();
    
    const imageWeight = weight / 100;
    const captionWeight = (100 - weight) / 100;
    const weightedResources = resources
      .map((resource) => ({
        ...resource,
        score: resource.imageDistance * imageWeight + resource.captionDistance * captionWeight
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, numResults);
    
    return json({ results: weightedResources });
  } catch (error: any) {
    console.error('Error:', error.message);
    return json({ error: error.message }, { status: 500 });
  }
};
