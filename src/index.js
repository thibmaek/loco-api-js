import FormData from 'form-data';

import fetch, { fetchFile } from './util/fetch';
import { defaultExportOptions } from './util/const';
import { intersect } from './util/array';
import env from './util/env';

export default class LocoClient {
  constructor(apiKey = process.env.LOCO_API_KEY, options = {}) {
    if (!apiKey) throw new Error('No valid API key found');

    this.apiKey = apiKey;
    this.options = options;
    this.defaultFileName = options.fileName || 'loco-locales';
  }

  /**
   * Returns all assets for the project.
   */
  getAssets = async () => await this.makeRequest('/assets');

    /**
   * Add a new translatable asset.
   * @param {Object} opts - parameters to pass to Loco
   * @param {string} opts.id
   * @param {string} opts.text
   * @param {string} opts.type
   * @param {string} opts.context
   * @param {string} opts.notes
   * @param {string} opts.default
   */
  createAsset = async (opts = {}) => {
    const formData = new FormData();
    for (const key in opts) {
      formData.append(key, opts[key]);
    }
    return this.makeRequest("/assets", {
      method: "POST",
      body: formData,
      headers: formData.getHeaders(),
    });
  };
  
  /**
   * Tags an asset with a new or existing term. If the tag doesn't exist it will be created.
   * @param {string} id Asset ID
   * @param {string} tag Name of new or existing tag
   */
  tagAsset = async (id, tag) => {
    const formData = new FormData();
    formData.append("name", tag);
    return this.makeRequest(`/assets/${id}/tags`, {
      method: "POST",
      body: formData,
      headers: formData.getHeaders(),
    });
  };

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

  getTranslation = async (assetId, locale, simple = true) => {
    const translation = await this.makeRequest(`/translations/${assetId}/${locale}`);
    if (simple) {
      return translation.translation
    }
  }

  /**
   * Export a specified locale.
   */
  exportLocale = async (locale, opts = {}) => {
    const params = { ...defaultExportOptions, ...opts };
    return this.doExport({
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

    const contents = await this.doExport(opts);
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

    return this.makeRequest(requestURL, undefined, true);
  }

  /**
   * @private
   * Return the query parameter for fitlering by tags
   */
  getTagFilterString = (params) => {
    if (!params.tags && !params.withoutTags) return '';

    const tags = Array.isArray(params.tags)
      ? params.tags.join(',')
      : params.tags

    const withoutTags = Array.isArray(params.withoutTags)
      ? params.withoutTags.map(tag => `!${tag}`).join(',')
      : params.withoutTags

    return `&filter=${
      tags || ''
    }${
      tags && withoutTags ? ',' : ''
    }${
      withoutTags || ''
    }`;
  }

  /**
   * @private
   * Read the complete locale(s) and export them
   */
  doExport = async (opts = {}) => {
    const params = { ...defaultExportOptions, ...opts };

    const requestURL = [
      `/export/${params.type}.${params.format}`,
      `?order=${params.order}&fallback=${params.fallback}`,
      this.getTagFilterString(params),
    ].join('')

    if (this.options.verbose && (params.tags || params.withoutTags)) {
      console.log(`[loco-api-js@export]: Filters have been provided: tags: ${params.tags} / withoutTags: ${params.withoutTags}`);
    }

    try {
      return this.makeRequest(requestURL);
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
    if (this.options.verbose) {
      console.log(`[loco-api-js@makeRequest]: Performing API request with URL: ${requestURL}`);
    }

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
