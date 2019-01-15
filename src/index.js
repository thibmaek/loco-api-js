import { intersect } from 'pure-fun/esm/arrays';

import fetch from './util/fetch';

export default class LocoClient {
  constructor(apiKey, options = {}) {
    this.apiKey = apiKey;
    this.options = options;
  }

  getAssets = async () => await this.makeRequest('/api/assets');
  getAsset = async (assetPath) => await this.makeRequest(`/api/assets/${
    Array.isArray(assetPath) ? assetPath.join('.') : assetPath
  }.json`)

  getAssetIds = async () => {
    const assets = await this.getAssets();
    return assets.map(asset => asset.id);
  }

  getAssetsByTags = async (tags) => {
    const assets = await this.getAssets();

    if (!Array.isArray(tags) && typeof tags === 'string') {
      return assets.filter(asset => asset.tags.includes(tags));
    }

    return assets.filter(asset => intersect(asset.tags, tags).length > 0);
  }

  makeRequest = async (apiPath) => await fetch(
    apiPath,
    {
      headers: {
        Authorization: `Loco ${this.apiKey}`,
      }
    }
  );
}
