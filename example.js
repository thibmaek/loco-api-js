const LocoClient = require('./dist/');

const loco = new LocoClient(
  /**
   * Provide the key by doing either:
   *    $ LOCO_API_KEY=... node example.js
   * or by exporting (only needs to happen once):
   *    $ export LOCO_API_KEY=...
   *    $ node example.js
   */
  process.env.LOCO_API_KEY,
  /**
   * Toggle client options here
   */
  {
    // fileName: 'example-output',
    // debug: true,
  }
);

const exportOptions = {
  /**
   * Only include assets with these tags
   */
  tags: ['production'],
  /**
   * Exclude assets carrying this tag
   */
  withoutTags: ['0.2.0'],
}

(async () => {
  console.log(await loco.getAssets());
  console.log(await loco.getAssetsByTags(['1.5.0']));
  console.log(await loco.getLocales());
  console.log(await loco.getLocaleKeys());
  console.log(await loco.getTranslation('asset.key', 'en'))
  console.log(await loco.getTranslation('asset.key', 'en', false)) // returns the full translation object
  console.log(await loco.exportToFile(exportOptions));
  console.log(await loco.exportArchive(exportOptions));
})();
