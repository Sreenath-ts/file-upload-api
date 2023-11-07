const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const jwt = require('../helpers/jwt')
const {roleValidation} = require('../helpers/validation')
router.get('/profile/:id',jwt.verify,roleValidation(['user']),userController.getProfile)

module.exports = router;