const File = require('../models/filesModel');
const fs = require('fs')
module.exports = {
    uploadFiles : async(req,res) => {
        let response = {
            message: "Internal error detected while uploading the file!",
            status: 401,
            authorization: true,
            data: {},
          }; 
          try {
            let session = res.locals.jwtUSER,
            userId = session.uid;
            res.locals.upload(req, res,async function (err) {
                if (err) {
                    console.log(err);
                    response.message = "Error: Invalid type of file!";
                    return res.json(response);
                  } else {
                    if (req.files == undefined) {
                      response.message = "Error: No File Selected!";
                      return res.json(response);
                    }else{
                      let files = []
                      req.files.forEach(e => {
                        files.push({fileName:e.filename,path:e.path,mimetype:e.mimetype})
                      });
                      
                      let oldFiles = await File.findOne({owner:userId});
                      if(oldFiles && oldFiles?.files?.length > 0){
                        files = files.concat(oldFiles.files)
                      }
                      console.log(files,'files');
                       File.findOneAndUpdate({owner:userId},
                           {$set:{files:files}},{upsert: true })
                        .then(result => {
                          console.log(result);
                          response.message = "file uploaded successfully!";
                          response.status = "ok";
                          return res.status(200).json(response);
                        }).catch((e)=>{
                          console.log(e);
                          response.message = `Internal error detected while uploading the file!`;
                          return res.status(200).json(response);
                        })
                    }
                }
            })
          } catch (e) {
            console.log(e);
            response.message = `Internal error detected while uploading the file!`;
            return res.status(200).json(response);
          }
    },
    getAllFiles : async (req,res) =>{
      let response = {
        message: "Something went wrong, please try again!",
        status: 401,
        authorization: true,
        data: {},
      };
      try {
        const userId = res.locals.jwtUSER.uid;
         let files = await  File.findOne({owner:userId}).select({files:1})
         console.log(files);
         response.message = 'Files detials successfully fetched'
         response.status = 'ok'
         response.data ={files:files.files}
         return res.status(200).json(response)
      } catch (error) {
        console.log(error);
        response.message =
          "Failed to retrieve file detials, Something went wrong, please try again!";
        return res.status(200).json(response);
      }
    },
    deleteFile : async (req,res) => {
      let response = {
        message: "Something went wrong, please try again!",
        status: 401,
        authorization: true,
        data: {},
      };
      try {
        const userId = res.locals.jwtUSER.uid;
        const filename = req.params.filename;
        const path = `./private/files/${userId}/${filename}`
        fs.unlink(path, (err) => {
          if (err) {
            console.error('Error deleting the file:', err);
            response.message = 'Error deleting the file:';
            return res.status(200).json(response)
          } else {
            console.log('File deleted successfully');
             File.findOneAndUpdate({owner:userId},{$pull:{files:{fileName:filename}}},{new:true})
             .then((result)=> {
              console.log(result);
                   response.message = 'File deleted successfully'
                   response.status = 'ok'
                   return res.status(200).json(response)
             })
             .catch((e)=> {
              console.log(e);
              response.message = "Something went wrong, please try again!"
              return res.status(200).json(response)
             })
          }
        });
      } catch (error) {
        console.log(error);
         response.message = "Something went wrong, please try again!"
         return res.status(200).json(response)
      }
    }
}