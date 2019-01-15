import fetch from 'isomorphic-unfetch';

export default async (apiPath, opts = {}) => await (
  await fetch(`https://localise.biz${apiPath}`, opts)
).json()
