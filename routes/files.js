const express = require('express');
const router = express.Router();
const jwt = require('../helpers/jwt')
const uploadMiddleWare = require('../helpers/fileUpload')
const fileController = require('../controllers/fileController')

router.post('/upload',jwt.verify,
uploadMiddleWare('files',5), 
fileController.uploadMultiple)

router.get('/all-files',jwt.verify,fileController.listFiles)

router.delete('/delete-file/:filename',jwt.verify,fileController.deleteFile)

module.exports = router;