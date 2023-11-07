let {  validationResult } = require("express-validator");
const {
  hashPassword,
  validateEmail,
} = require("../helpers/validation");
let { addUser, validateUser } = require("../models/userModel");
let User = require("../models/userModel");
const jwt = require('../helpers/jwt')
module.exports = {
    signup : async (req,res) => {
        let response = {
            message: "Something went wrong!",
            status: 401,
            authorization: true,
            data: {},
          };
          try{
          const errors = validationResult(req);
          if (!errors.isEmpty()) {
            console.log(errors);
            response.message =
              errors.errors[0].path +
              " " +
              (errors.errors[0].msg == "Invalid value"
                ? "is invalid, please check the value!"
                : errors.errors[0].msg);
            return res.status(200).json(response);
          }
        let newUser = await  addUser({
            username: req.body.username.replace(/[ ]+/g, "_"),
            email: req.body.email,
            password:{
              hash: hashPassword(req.body.password),
              updatedTime: new Date()
            }
          })
          let token = jwt.sign({
            uid: newUser._id,
            role: newUser.role,
          });
           // Set token in cookie with one-month expiration
           const oneMonth = 30 * 24 * 60 * 60 * 1000;
           const expirationDate = new Date(Date.now() + oneMonth);

           res.cookie("token", token.token.accessToken, {
             httpOnly: true,
             expires: expirationDate,
             domain: process.env.cookieDomain,
             path: "/",
           });
           response.message = "Account Created Successful!"; 
           response.status = "ok";
           response.data = {token: token.token.accessToken}
           res.json(response); // Send the response here
        }
        catch(err) {
          console.log(err);
            response.message = "Authentication error, try login now!";
            if (err.code == 11000) {
              let exist = Object.keys(err.keyValue)[0];
              response.message = `${exist} is already exists, please try login with the email!`;
            }
            res.json(response); // Send the response here in case of an error
          };
    },
    login : async (req,res) => {
      let response = {
        message: "Authentication Failed due to invalid credentials, please  try again!",
        status: 401,
        authorization: true,
        data: {},
      };
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          response.message =
            errors.errors[0].msg == "Invalid value"
              ? errors.errors[0].path + " is invalid, please check the value!"
              : errors.errors[0].path + errors.errors[0].msg;
          return res.status(200).json(response);
        }
        let uData = await validateUser(req.body); //false or userdata
        console.log(uData);
        if(uData){
          let token = jwt.sign({ uid: uData._id, role: uData.role });
          const oneMonth = 30 * 24 * 60 * 60 * 1000;
          const expirationDate = new Date(Date.now() + oneMonth);
          res.cookie("token", token.token.accessToken, {
            httpOnly: true,
            expires: expirationDate,
            domain: process.env.cookieDomain,
            path: "/",
          });
          response.message = "Logged in Successful!";
          response.status = "ok";
          response.data = {token: token.token.accessToken}
           res.json(response); // Send the response here
        }else{
          return res.status(200).json(response);
        }
      } catch (error) {
        console.log(error);
    response.message = "Authentication failed due to internal error!";
    return res.status(200).json(response);
      }
    }
}