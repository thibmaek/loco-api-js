import fetch, { fetchFile } from './util/fetch';
import { defaultExportOptions } from './util/const';
import { intersect } from './util/array';
import env from './util/env';

export default class LocoClient {
  constructor(apiKey = process.env.LOCO_API_KEY, options = {}) {
    if (!apiKey) throw new Error('No valid API key found');

    this.apiKey = apiKey;
    this.options = options;
  }

  get defaultFileName() {
    return this.options.fileName || 'loco-locales';
  }

  /**
   * Returns all assets for the project.
   */
  getAssets = async () => await this.makeRequest('/assets');

  /**
   * Returns one specific asset by the given id (string) or array of strings
   */
  getAsset = async (assetPath) => await this.makeRequest(`/assets/${
    Array.isArray(assetPath) ? assetPath.join('.') : assetPath
  }.json`)

  /**
   * Returns all assets, mapped to their ids
   */
  getAssetIds = async () => {
    const assets = await this.getAssets();
    return assets.map(asset => asset.id);
  }

  /**
   * Returns assets by a given tag (string) or tags (array of strings).
   */
  getAssetsByTags = async (tags) => {
    const assets = await this.getAssets();

    if (!Array.isArray(tags) && typeof tags === 'string') {
      return assets.filter(asset => asset.tags.includes(tags));
    }

    return assets.filter(asset => intersect(asset.tags, tags).length > 0);
  }

  /**
   * Returns all locales for the project.
   */
  getLocales = async () => await this.makeRequest('/locales');

  /**
   * Returns all locales, mapped to their shortcodes.
   */
  getLocaleKeys = async () => {
    const locales = await this.getLocales();
    return locales.map(locale => locale.code);
  };

  /**
   * Export a specified locale.
   */
  exportLocale = async (locale, opts = {}) => {
    const params = { ...defaultExportOptions, ...opts };
    return this.export({
      ...params,
      type: `locale/${locale}`,
    });
  }

  /**
   * Export all locales to one JSON file.
   */
  exportToFile = async (opts = {}, formatted = true) => {
    if (!env.isNode) throw new Error(`exportToFile is only supported in Node`);

    const fs = require('fs');
    const { promisify } = require('util');
    const writeFileAsync = promisify(fs.writeFile);

    const contents = await this.export(opts);
    await writeFileAsync(`${this.defaultFileName}.json`, JSON.stringify(contents, null, formatted ? 2 : 0));
  }

  /**
   * Export all locales, split up in folders but in an archive (zip).
   */
  exportArchive = async (opts = {}) => {
    if (!env.isNode) throw new Error(`exportArchive is only supported in Node`);

    const params = { ...defaultExportOptions, ...opts };

    const requestURL = [
      `/export/archive/json.zip`,
      `?order=${params.order}&fallback=${params.fallback}`,
      params.tags ? `&${this.getTagFilterString(params.tags)}` : '',
    ].join('');

    console.log(requestURL);

    return this.makeRequest(requestURL, undefined, true);
  }

  /**
   * @private
   * Return the query parameter for fitlering by tags
   */
  getTagFilterString = (tags) => {
    return `filter=${
      Array.isArray(tags) ? tags.join(','): tags
    }`;
  }

  /**
   * @private
   * Read the complete locale(s) and export them
   */
  export = async (opts = {}) => {
    const params = { ...defaultExportOptions, ...opts };
    try {
      return this.makeRequest([
        `/export/${params.type}.${params.format}`,
        `?order=${params.order}&fallback=${params.fallback}`,
        params.tags ? `&${this.getTagFilterString(params.tags)}` : '',
      ].join(''));
    } catch (error) {
      console.error('Error exporting locale: ', error);
    }
  }

  /**
   * @private
   * Make a request against the Loco REST API.
   * This function can be used to fetch text and binary data and includes
   * all the necessary headers and params needed to use the REST API.
   */
  makeRequest = async (apiPath, requestOptions = {}, binaryData = false) => {
    if (binaryData) {
      return fetchFile(apiPath, {
        headers: {
          Authorization: `Loco ${this.apiKey}`,
        },
        ...requestOptions,
      }, `${this.defaultFileName}.zip`)
    }

    return fetch(apiPath, {
      headers: {
        Authorization: `Loco ${this.apiKey}`,
      },
      ...requestOptions,
    });
  }
}
