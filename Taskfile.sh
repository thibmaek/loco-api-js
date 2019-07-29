#!/usr/bin/env bash
set -e

function publish() {
  echo "Started publishing loco-api-js@$npm_package_version"

  npm run build && npm test && \
    git commit -am "$npm_package_version" && git tag "$npm_package_version" && \
    git push && git push --tags && \
    npm publish
}

function main() {
  exit 0
}

"${@:-main}"
