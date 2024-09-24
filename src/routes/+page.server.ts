import { env } from '$lib/env';

export const load = () => {
  return {
    blobSasToken: env.BLOB_STORAGE_SAS_TOKEN
  };
};
