const express = require('express');
const router = express.Router();
const jwt = require('../helpers/jwt')
const {multer_init,profileFolderManager} = require('../helpers/fileUpload')
const fileController = require('../controllers/fileController')

router.post('/upload',jwt.verify,
profileFolderManager({privacy:true}), 
multer_init({filename:'file'}),fileController.uploadFiles)

router.get('/all-files',jwt.verify,fileController.getAllFiles)

router.delete('/delete-file/:filename',jwt.verify,fileController.deleteFile)

module.exports = router;