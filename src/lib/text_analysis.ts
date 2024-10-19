import { TextAnalysisClient, AzureKeyCredential } from "@azure/ai-language-text";
import { env } from "$lib/env";

const textAnalysisClient = new TextAnalysisClient(String(env.LANGUAGE_AI_API_ENDPOINT), new AzureKeyCredential(String(env.LANGUAGE_AI_API_KEY)));
export { textAnalysisClient };