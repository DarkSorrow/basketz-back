
module.exports.addToken = async (ctx) => {
  ctx.type = "text";
  ctx.body = "test";
}

module.exports.removeToken = async (ctx) => {
  ctx.type = "text";
  ctx.body = "test";
}

module.exports.getNotification = async (ctx) => {
  ctx.type = "text";
  ctx.status = 200;
  ctx.body = "test";
}
