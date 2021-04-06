const Router = require('koa-router');
const commonController = require('../controllers/common');
const uploadController = require('../controllers/upload');
const router = new Router();
router.post(
  '/upload/avatar',
  commonController.verifyJWT,
  uploadController.uploadAvatar.single('avatar'),
  uploadController.addAvatar
);

router.post(
  '/upload/background',
  commonController.verifyJWT,
  uploadController.uploadAvatar.single('background'),
  uploadController.addBackground
);

router.post(
  '/upload/gallery/:hunt/:category',
  commonController.verifyJWT,
  uploadController.uploadGallery.single('gallery'),
  uploadController.addGallery
);

module.exports = router;