const Koa = require('koa');
const cors = require('@koa/cors');
const mount = require('koa-mount');
const helmet = require('koa-helmet');
const serve = require('koa-static');
const path = require('path');
const env = require('./utils/environement');
const logger = require('./services/logger');
const error = require('./services/error');
const common = require('./controllers/common');

const app = new Koa();

/*const templates = {
  clue: require("./views/clue-editor.marko"),
};*/
/**
 * Configuration added to the ctx
 */
app.context.logger = logger;
app.context.error = error;
//app.context.templates = templates;
/**
 * Controller added to every routes
 */
//app.use(helmet());
// app.use(helmet.contentSecurityPolicy()); // need to put editor route outside
app.use(helmet.dnsPrefetchControl());
app.use(helmet.expectCt());
app.use(helmet.frameguard());
app.use(helmet.hidePoweredBy());
app.use(helmet.hsts());
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy());
app.use(helmet.xssFilter());
app.use(common.requestCreation);

// Routes added here won't be catch but the error log
/**
 * Routes below will get logging and a global error catch
 */
app.use(common.errorLog);

app.use(helmet.contentSecurityPolicy());
app.use(cors());

const uploadRoutes = require('./routes/upload');
app.use(uploadRoutes.routes());

const notificationRoutes = require('./routes/notification');
app.use(notificationRoutes.routes());

let server;
server = app.listen(env.port, () => {
  let shuttingDown = false;
  function gracefulExit() {
    if (shuttingDown) {
      // We already know we're shutting down, don't continue this function
      return;
    }
    shuttingDown = true;
    logger.warn('[App::gracefulExit] Received kill signal (SIGTERM|SIGINT), shutting down...');
    // Don't bother with graceful shutdown in development
    if (env.node_env !== 'production') {
      process.exit(0);
    }
    setTimeout(() => {
      logger.error('[App::gracefulExit] Could not close connections in time, forcefully shutting down');
      process.exit(1);
    }, 8000);// wait 8 seconds
    server.close(async () => {
      // TODO: Check and close remaining db connections
      /* await dbRedis.quit();
      await dbIdentity._cql.shutdown(); */
      logger.info('[App::gracefulExit] Closed out remaining connections');
      process.exit(0);
    });
  }
  process.on('SIGTERM', gracefulExit);
  process.on('SIGINT', gracefulExit);
  logger.warn(
    { port: env.post, env: env.node_env, iss: env.appUrl, idpUrl: env.idpUrl },
    '[App::init]',
  );
});