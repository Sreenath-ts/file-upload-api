const mongoose = require("mongoose");
const validator = require("../helpers/validation");

const userSchema = new mongoose.Schema({
    email: {
      type: String,
      required: true,
      index:true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      index:true,
      unique: true,
    },
    password: {
        hash: String,
        updatedTime: Date
    },
    role:{
      type: String,
      enum: ['user', 'admin','root'],
      default:'user',
      required: true
    }
  });
  
  
  
  let users = (module.exports = mongoose.model("users", userSchema));

  module.exports.addUser = function (data) {
    let uNew = new users(data);
    return uNew.save();
  };

  module.exports.validateUser = async function (reqBody) {
    try {
      let data = {};
      if (validator.validateEmail(reqBody.user)) {
        data.email = reqBody.user;
      } else {
        data.username = reqBody.user;
      }
      let uData = await users.findOne(data);
      console.log(uData,'..',data);
      if (uData) {
        if (
          await validator.hashPasswordvalidate(
            reqBody.password,
            uData.password.hash
          )
        ) {
          return uData;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  };