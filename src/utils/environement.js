const keys = require('./keys');

let idpUrl = (process.env.IDP_URL) ? process.env.IDP_URL.trim() : 'https://basketz-login.texky.com';
if (idpUrl.endsWith('/')) {
  idpUrl = idpUrl.slice(0, -1);
}

module.exports = {
  idpUrl,
  appUrl: (process.env.APP_URL) ? process.env.APP_URL.trim() : 'https://basketz-back.texky.com',
  port: (process.env.APP_PORT) ? parseInt(process.env.APP_PORT.trim(), 10) : 8444,
  node_env: (process.env.NODE_ENV) ? process.env.NODE_ENV.trim() : 'developement',
  upload_dir: (process.env.UPLOAD_DIRECTORY) ? process.env.UPLOAD_DIRECTORY.trim() : '/var/www/html/image/static-images',
  gallery: {
    directory: (process.env.GALLERY_DIRECTORY) ? process.env.GALLERY_DIRECTORY.trim() : 'gallery',
  },
  infura_url: (keys.infura_id) ? `https://mainnet.infura.io/v3/${keys.infura_id}` : '',
}