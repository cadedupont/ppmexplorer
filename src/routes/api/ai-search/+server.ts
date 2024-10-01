import { json } from '@sveltejs/kit';
import { env } from '$lib/env';
import { SearchClient, AzureKeyCredential } from '@azure/search-documents';

export const POST = async ({ request }) => {
  try {
    const { query, numResults } = await request.json();
    const searchClient = new SearchClient(
      String(env.AZURE_AI_SEARCH_ENDPOINT),
      String(env.AZURE_AI_SEARCH_INDEX),
      new AzureKeyCredential(String(env.AZURE_AI_SEARCH_API_KEY))
    );
    const searchResults = await searchClient.search('*', {
      vectorSearchOptions: {
        queries: [
          {
            kind: 'text',
            text: query,
            fields: ['captionVector'],
            kNearestNeighborsCount: parseInt(numResults, 10)
          }
        ]
      }
    });
    const results = [];
    for await (const result of searchResults.results) {
      results.push(result.document);
    }
    return json({ results });
  } catch (error: any) {
    console.error('Error:', error.message);
    return json({ error: error.message }, { status: 500 });
  }
};
