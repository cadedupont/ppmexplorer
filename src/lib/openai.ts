import { AzureOpenAI } from 'openai';
import { env } from '$lib/env';

const openaiClient = new AzureOpenAI({
  endpoint: String(env.AZURE_OPENAI_ENDPOINT)
});
export { openaiClient };
