import { env } from '$lib/env';

export const load = async () => {
  try {
    const images = [1, 3, 4].map(
      (i) => `${env.BLOB_STORAGE_URL}/volume${i}/page${i}/image1.jpg?${env.BLOB_STORAGE_SAS_TOKEN}`
    );
    return {
      images
    };
  } catch (err) {
    console.error(err);
  }
};
