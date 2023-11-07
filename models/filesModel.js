const mongoose = require("mongoose");

const filesSchema = new mongoose.Schema({
   owner :{
    type:String,
    ref:'users'
   },
   files :{
    type:[{fileName : String,path: String, mimetype: String}],
    default:[]
   }
  });
  
  
  
  let files = (module.exports = mongoose.model("fileModel", filesSchema));