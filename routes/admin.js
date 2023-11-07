const express = require('express');
const router = express.Router();

const jwt = require('../helpers/jwt');
const { roleValidation } = require('../helpers/validation');
const adminController = require('../controllers/adminController')
router.get('/all-users',jwt.verify,roleValidation(['admin','root']),adminController.getUsers)

module.exports = router;