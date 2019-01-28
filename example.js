const LocoClient = require('./dist/');

const loco = new LocoClient();

(async () => {
  console.log(await loco.getAssets());
  console.log(await loco.getAssetsByTags(['1.5.0']));
  console.log(await loco.getLocales());
  console.log(await loco.getLocaleKeys());
  console.log(await loco.exportToFile());
  console.log(await loco.exportArchive());
})();
