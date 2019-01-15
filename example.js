const LocoClient = require('loco-api-js');

const loco = new LocoClient('<your-api-key>');

(async () => {
  console.log(await loco.getAssets());
  console.log(await loco.getAsset('some.asset.path'));
  console.log(await loco.getAsset(['some', 'asset', 'path']));
  console.log(await loco.getAssetsByTags(['1.5.0']));
})();
