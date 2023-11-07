const express = require("express");
const router = express.Router();
const {signupValidate,loginValidate} = require("../helpers/validation");
const authController = require("../controllers/authController");

router.post("/signup", signupValidate, authController.signup);
router.post("/login", loginValidate, authController.login);
module.exports = router;