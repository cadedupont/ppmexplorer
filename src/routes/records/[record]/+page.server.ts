import { env } from '$lib/env';

export const load = async ({ params, fetch }) => {
  const response = await fetch(`/api/records/${params.record}`);
  const record = await response.json();
  return {
    ...record,
    blobSasToken: env.BLOB_STORAGE_SAS_TOKEN
  };
}