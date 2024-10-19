import { CosmosClient } from '@azure/cosmos';
import { env } from '$lib/env';

const cosmosClient = new CosmosClient({
  endpoint: String(env.COSMOS_DB_ENDPOINT),
  key: String(env.COSMOS_DB_KEY)
});
const cosmosContainer = cosmosClient
  .database(String(env.COSMOS_DB_NAME))
  .container(String(env.COSMOS_DB_CONTAINER_NAME));
export { cosmosContainer };