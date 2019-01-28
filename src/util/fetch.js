import fetch from 'isomorphic-unfetch';
import fs from 'fs';

import env from './env';

/**
 * Utility function to fetch JSON from the Loco API
 */
export default async (subPath, opts = {}) => {
  try {
    return await (
      await fetch(`https://localise.biz/api${subPath}`, opts)
    ).json()
  } catch (error) {
    console.error('Error when getting data from Loco API: ', error);
  }
}

/**
 * Calls the Loco API and saves the response to a file
 */
export const fetchFile = async (subPath, opts = {}) => {
  if (!env.isNode) throw new Error(`Fetching files is only supported in Node`);

  const response = await fetch(`https://localise.biz/api${subPath}`, opts);
  const dest = fs.createWriteStream('./loco-locales.zip');

  return response.body.pipe(dest);
}
