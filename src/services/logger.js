const Pino = require('pino');
const os = require('os');

const env = require('../utils/environement');
const pkg = require('../../package.json');

let levelUsed = 'trace';
let prettyPrint = {
  translateTime: true,
  ignore: 'tq_name,tq_host',
};
if (env.node_env === 'test') {
  levelUsed = 'silent';
} else if (env.node_env === 'production') {
  levelUsed = 'info';
  prettyPrint = false;
}

module.exports = Pino({
  level: levelUsed,
  prettyPrint,
  customLevels: {
    notice: 35,
  },
  base: {
    app_name: pkg.name,
    app_host: os.hostname(),
    pid: process.pid,
  },
});
