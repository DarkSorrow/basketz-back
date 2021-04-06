const multer = require('@koa/multer');
const path = require('path');
const { nanoid } = require('nanoid');
const fs = require('fs');
const fsPromises = fs.promises;
const env = require('../utils/environement');

//Upload File Storage Path and File Naming
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join('/home/ubuntu/tmp/avatar'))
    },
    filename: function (req, file, cb) {
      cb(null, nanoid(18))
    }
});

const mimeExtension = {
  'image/apng': '.apng',
  'image/gif': '.gif',
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
}

const mimeAccepted = [
  'image/apng',
  'image/gif',
  'image/jpeg',
  'image/png',
  'image/webp',
];

const extensionAccepted = [
  '.apng',
  '.gif',
  '.jpg', '.jpeg', '.jfif', '.pjpeg', '.pjp',
  '.png',
  '.webp',
];

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname);
  if (extensionAccepted.indexOf(ext) !== -1) {
    file.extension = ext;
    cb(null, true);
    return ;
  } else if (mimeAccepted.indexOf(file.mimetype) !== -1) {
    file.extension = mimeExtension[file.mimetype];
    cb(null, true);
    return ;
  }
  cb(new Error('File not supported'), false);
}

module.exports.uploadAvatar = multer({ 
  storage,
  fileFilter,
  limits: {
    fields: 0,//Number of non-file fields
    fileSize: 500 * 1024,//File Size Unit b 500kb
    files: 1//Number of documents
  }
});

module.exports.uploadBackground = multer({ 
  storage,
  fileFilter,
  limits: {
    fields: 0,//Number of non-file fields
    fileSize: 2000 * 1024,//File Size Unit b 2Mb
    files: 1//Number of documents
  }
});

module.exports.uploadGallery = multer({ 
  storage,
  fileFilter,
  limits: {
    fields: 0,//Number of non-file fields
    fileSize: 10000 * 1024,//File Size Unit b 10Mb
    files: 1//Number of documents
  }
});

async function verifyDirectory(directory) {
  try {
    await fsPromises.access(directory, fs.constants.F_OK);
  } catch (err) {
    await fsPromises.mkdir(directory)
  }
}

const updatePicture = 'UPDATE auth.user_informations SET picture=?,updated_at=? WHERE subject=?;';
const updateLoginProfile = 'UPDATE auth.login SET profile_update=? WHERE subject=?;';
const rootDirprofile = path.join(env.upload_dir, '/profile');
module.exports.addAvatar = async (ctx) => {
  // Log in database the info about this file? tmp etc
  const profileDir = path.join(rootDirprofile, ctx.state.reqInfo.sub);
  await verifyDirectory(profileDir);
  const updateAt = new Date();
  const file = `avatar${ctx.file.extension}`;
  await fsPromises.copyFile(ctx.file.path, `${profileDir}/${file}`);
  const picture = `http://static-img.texky.com/profile/${ctx.state.reqInfo.sub}/${file}?random=${updateAt.toISOString()}`
  ctx.status = 201;
  ctx.body = {
    success: true,
    picture,
  };
}

module.exports.addBackground = async (ctx) => {
  // Log in database the info about this file? tmp etc
  const profileDir = path.join(rootDirprofile, ctx.state.reqInfo.sub);
  await verifyDirectory(profileDir);
  const file = `background${ctx.file.extension}`;
  await fsPromises.copyFile(ctx.file.path, `${profileDir}/${file}`);/*${ctx.file.extension} */
  ctx.status = 201;
  ctx.body = {
    success: true,
  };
}

const rootDirClues = path.join(env.upload_dir, env.gallery.directory);
module.exports.addGallery = async (ctx) => {
  // Log in database the info about this file? tmp etc
  const category = ctx.params.category;
  const hunt = parseInt(ctx.params.hunt, 10);
  const cluesDir = path.join(rootDirClues, category);
  await verifyDirectory(cluesDir);
  const file = `${nanoid(12)}${ctx.file.extension}`;
  await fsPromises.copyFile(ctx.file.path, `${cluesDir}/${file}`);/*${ctx.file.extension} */
  const picture = await cluesService.insertGallery(
    hunt,
    category,
    `${cluesDir}/${file}`,
    `${env.gallery.directory}/${category}/${file}`,
    {//add size
      ext: ctx.file.extension,
      mimeType: 'image/',
    },
  );
  ctx.status = 201;
  ctx.body = {
    success: true,
    data: picture,
  };
}
