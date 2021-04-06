const Router = require('koa-router');
const commonController = require('../controllers/common');
const notificationController = require('../controllers/notification');
const router = new Router();

router.get(
  '/notification/json',
  notificationController.getNotification
);


router.post(
  '/notification/device',
  commonController.verifyJWT,
  notificationController.addToken
);

router.delete(
  '/notification/device/:tokenUrl',
  commonController.verifyJWT,
  notificationController.removeToken
);

module.exports = router;