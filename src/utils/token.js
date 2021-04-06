const { default: jwtVerify } = require('jose/jwt/verify');
const { default: createRemoteJWKSet } = require('jose/jwks/remote')
const {nanoid} = require('nanoid');
const env = require('./environement');

/**
 * aud: tq.{uri}
 * 
 */
class TokenManager {
  constructor() {
    this.JWKS = createRemoteJWKSet(new URL(`${env.idpUrl}/.identity-provider`));
  };

  /**
   * 
   * @param {*} payload 
   */

  async verifyToken(accessToken) {
    const { payload } = await jwtVerify(accessToken, this.JWKS, {
      issuer: env.idpUrl,
    });
    return (payload);
  }
}

module.exports = new TokenManager();