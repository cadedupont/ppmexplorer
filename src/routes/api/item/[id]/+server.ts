import { json } from '@sveltejs/kit';
import { container } from '$lib/cosmos';

export const GET = async ({ params }) => {
  const { resources: items } = await container.items
    .query({
      query: `SELECT c.id, c.imageURL, c.caption, c.caption_en, c.volume, c.page, c.location, c.imageVector FROM c WHERE c.id = @itemID`,
      parameters: [{ name: '@itemID', value: params.id }]
    })
    .fetchAll();
  if (items.length === 0) {
    return json({ error: 'Item not found', status: 404 });
  }
  const item = items[0];

  const { resources: similarItems } = await container.items
    .query({
      query: `SELECT c.id, c.imageURL, c.caption_en, c.volume, c.page, c.location FROM c ORDER BY VectorDistance(c.imageVector, @embedding) OFFSET 1 LIMIT 10`,
      parameters: [{ name: '@embedding', value: item.imageVector }]
    })
    .fetchAll();
  return json({ item, similarItems });
};
