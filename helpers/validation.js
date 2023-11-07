let { check } = require("express-validator");
let bcrypt = require("bcrypt");

module.exports = {
    signupValidate: [
        check("username")
          .isLength({ min: 5 })
          .withMessage("is invalid, must contain minimum of 5 letters")
          .isLength({ max: 15 })
          .withMessage("is invalid, must contain maximum of 15 letters")
          .matches(/[a-zA-Z0-9]/)
          .withMessage("Username must contain at least one letter (alphabet)")
          .matches(/^[A-Za-z_.0-9]+$/)
          .withMessage(
            "Only letters, underscore and dot are allowed in the username"
          )
          .trim(),
        check("email")
          .isEmail()
          .normalizeEmail()
          .withMessage("is invalid, must be a valid email!")
          .trim(),
        check("password")
          .isLength({ min: 8 })
          .withMessage("must be at least 8 chars long")
          .trim()
          .custom((value, { req }) => {
            if (value !== req.body.repassword) {
              return Promise.reject("didn't match, please recheck the password");
            } else {
              return Promise.resolve();
            }
          }),
      ] ,
      
      validateEmail: (email) => {
        return email.match(
          /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
      },
      hashPassword: (plaintextPassword) => {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(plaintextPassword, salt);
        return hash;
      },
      loginValidate: [
        check("user").isLength({ min: 4 }).withMessage(" is not valid!").trim(),
        check("password").isLength({ min: 8 }).withMessage(" is not valid!").trim(),
      ],
      hashPasswordvalidate: async (plaintextPassword, hash) => {
        const result = await bcrypt.compare(plaintextPassword, hash);
        return result;
      },
      validateUserId : (id) => {
        id = id.trim();
        if(id.length == 24){
          return id;
        }else{
          return false;
        }
      },
      roleValidation : (role=['user']) => {
        return  async (req, res, next) => {
          let response = {
            message:
            "It seems you have not authorized, please login to get access to this area!",
            status: 401,
            authorization:false,
            data: {},
          };
          if(!role.includes(res.locals.jwtUSER.role)){
            return res.status(200).json(response);
          }else{
            next()
          }
        }
      }
}