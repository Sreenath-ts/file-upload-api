const multerS3 = require('multer-s3');
const multer = require('multer'); 
const path = require('path'); 
require('dotenv').config()
const s3 = require('../helpers/utils/s3.util'); 

const validFileTypes = ['image/jpeg', 'image/png', 'video/mp4', 'application/pdf', 'application/msword'];

const storage = multerS3({
  s3,
  acl: 'public-read',
  bucket: process.env.AWS_BUCKET,
  contentType: multerS3.AUTO_CONTENT_TYPE,
  key: (req, file, cb) => {   
    const fileName = `${Date.now()}_${Math.round(Math.random() * 1E9)}`;
    cb(null, `${fileName}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (validFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Allowed types are image/jpeg, image/png, video/mp4, application/pdf, and application/msword.'), false);
  }
};

const limits = {
  fileSize: 5 * 1024 * 1024, // 5MB limit
};

const upload = multer({
  storage,
  fileFilter,
  limits,
});

const uploadMiddleWare = function (name,fileNumber) {
 return  (req,res,next) => {
    res.locals.upload = upload.array(name, fileNumber)
    next()
  }
}


module.exports = uploadMiddleWare;