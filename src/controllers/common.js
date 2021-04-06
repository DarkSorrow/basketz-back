/**
 * Common controller
 * Contains controller that can be used in different routes, they should be found in 
 */
const {nanoid} = require('nanoid');
const tokenManager = require('../utils/token');

function parseRequestId(headers) {
  return ((
    (headers['x-req-id']) && (headers['x-req-id'].length === 16)
  ) ? headers['x-req-id'] : nanoid(16));
}

/**
 * @typedef RequestInfo
 * @type {object}
 * @property {Buffer} rid    - salt used to encrypt
 * @property {Buffer} sub    - subject used for this request
 * @property {Buffer} client - client calling
 */
module.exports.requestCreation = async (ctx, next) => {
  ctx.state.reqInfo = {
    rid: parseRequestId(ctx.request.header),
    sub: '',
    client: '',
  };
  await next();
}

module.exports.errorLog = async (ctx, next) => {
  const start = Date.now();
  try {
    await next();
    ctx.logger.info({
      reqNfo: ctx.state.reqInfo,
      method: ctx.request.method,
      url: ctx.request.url,
      ip: ctx.request.ip,
      respTime: Date.now() - start,
      status: ctx.response.status,
    }, '');
  } catch (err) {
    ctx.status = 500;
    ctx.body = ctx.error.getError('001');
    ctx.logger.error({
      reqNfo: ctx.state.reqInfo,
      error: {
        msg: err.message || '',
        stack: err.stack || '',
        code: err.code || '',
      },
      method: ctx.request.method,
      url: ctx.request.url,
      ip: ctx.request.ip,
      respTime: Date.now() - start,
      status: ctx.response.status,
    }, '');
  }
}

module.exports.verifyJWT = async (ctx, next) => {
  try {
    if (ctx.header['authorization']) {
      const parsedUser = await tokenManager.verifyToken(ctx.header['authorization'].substr(7));
      if (parsedUser.sub) {
        ctx.state.reqInfo.sub = parsedUser.sub;
        ctx.state.reqInfo.client = parsedUser.aud;
        ctx.state.reqInfo.iat = parsedUser.iat;
        await next();
        return;
      }
    }
  } catch (err) {
    ctx.logger.error({ error: err.toString() }, 'trigger error from verifyJWT');
  }
  ctx.status = 401;
  ctx.body = ctx.error.getError('003');
}

module.exports.verifyJWTAdmin = async (ctx, next) => {
  try {
    if (ctx.header['authorization']) {
      const parsedUser = await tokenManager.verifyToken(ctx.header['authorization'].substr(7));
      if (parsedUser.sub) {
        ctx.state.reqInfo.sub = parsedUser.sub;
        ctx.state.reqInfo.client = parsedUser.aud;
        ctx.state.reqInfo.iat = parsedUser.iat;
        await next();
        return;
      }
    }
  } catch (err) {
    ctx.logger.error({ error: err }, 'verifyJWT');
  }
  ctx.status = 401;
  ctx.body = ctx.error.getError('003');
}