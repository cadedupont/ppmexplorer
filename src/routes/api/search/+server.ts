import { json } from '@sveltejs/kit';
import { env } from '$lib/env';
import { container } from '$lib/cosmos';

const generateEmbedding = async (query: string): Promise<number[]> => {
  try {
    const response = await fetch(
      `${env.AI_VISION_ENDPOINT}computervision/retrieval:vectorizeText?api-version=${env.AI_VISION_API_VERSION}&model-version=${env.AI_VISION_MODEL_VERSION}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Ocp-Apim-Subscription-Key': String(env.AI_VISION_KEY)
        },
        body: JSON.stringify({ text: query })
      }
    );
    const data = await response.json();
    return data.vector;
  } catch (err) {
    console.error('Error:', err);
    return [];
  }
};

export const POST = async ({ request }) => {
  try {
    const { query, numResults, vectorType } = await request.json();
    if (!query || !numResults || !vectorType) {
      throw new Error('Missing required parameters');
    }

    const embedding = await generateEmbedding(query);
    if (embedding.length === 0) {
      throw new Error('Failed to generate embedding');
    }
    const { resources } = await container.items
      .query({
        query: `SELECT TOP @numResults c.id, c.imageURL, c.caption, c.volume, c.page, c.location FROM c ORDER BY VectorDistance(c.${vectorType}, @embedding)`,
        parameters: [
          { name: '@numResults', value: parseInt(numResults, 10) },
          { name: '@embedding', value: embedding }
        ]
      })
      .fetchAll();

    return json({ items: resources });
  } catch (error: any) {
    console.error('Error:', error.message);
    return json({ error: error.message }, { status: 500 });
  }
};
