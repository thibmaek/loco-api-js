# loco-api-js

[![standard-readme compliant](https://img.shields.io/badge/standard--readme-OK-green.svg)](https://github.com/RichardLitt/standard-readme)
[![latest-release](https://badgen.net/github/release/thibmaek/loco-api-js)](https://github.com/thibmaek/loco-api-js)
[![license](https://badgen.net/github/license/thibmaek/loco-api-js)](https://github.com/thibmaek/loco-api-js/LICENSE)
[![npm-latest](https://badgen.net/npm/v/loco-api-js)](https://www.npmjs.com/package/loco-api-js)
[![size-cjs](https://badgen.net/badgesize/normal/https://unpkg.com/loco-api-js/dist/index.js)](https://unpkg.com/loco-api-js/dist/index.js)
[![size-es](https://badgen.net/badgesize/normal/https://unpkg.com/loco-api-js/dist/index.es.js)](https://unpkg.com/loco-api-js/dist/index.es.js)

> Javascript API wrapper for Loco translation system&#39;s REST API

Convenience API wrapper around the [Loco](https://localise.biz) REST API, written in modern Javascript.
Modules are provided as CommonJS, UMD and ESM.

## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [API](#api)
- [Maintainers](#maintainers)
- [Contributing](#contributing)
- [License](#license)

## Install

```console
npm i loco-api-js
yarn add loco-api-js
```

## Usage

See and run [example.js](https://github.com/thibmaek/loco-api-js/example.js) or [try it out in a REPL](https://repl.it/@thibmaek/node-loco-api-js-demo)

```js
// ESM (Bundlers, Modern engines)
import LocoClient from 'loco-api-js';

// CJS (Node)
const LocoClient = require('loco-api-js');

const loco = new LocoClient('<your-api-key>');

(async () => {
  console.log(await loco.getAssets());
  console.log(await loco.getAsset('some.asset.path'));
  console.log(await loco.getAsset(['some', 'asset', 'path']));
  console.log(await loco.getAssetsByTags(['1.5.0']));
  console.log(await loco.exportArchive());
})();
```

## API

## Maintainers

[@thibmaek](https://github.com/thibmaek)

## Contributing

PRs accepted.

Small note: If editing the README, please conform to the [standard-readme](https://github.com/RichardLitt/standard-readme) specification.

## License

MIT © 2019 Thibault Maekelbergh
