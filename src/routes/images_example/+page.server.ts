import { env } from '$lib/env';
import https from 'https';

// very bad not good
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

export const load = async () => {
  try {
    const response = await fetch(`${env.IMAGES_CAPTIONS_URL}/db/images_small.json`, {
      // very bad not good
      agent: new https.Agent({ rejectUnauthorized: false })
    });
    const images = await response.json();
    return { images };
  } catch (err) {
    console.error('Error fetching PPM image data:', err);
  }
};
