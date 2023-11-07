const fs = require("fs");
const path = require("path");

module.exports = {
    multer_init: (args={filename}) => {
        return (req, res, next) => {
          let response = {
            message: "Something went wrong!",
            status: 401,
            authorization:true,
            data: {},
          };
          try {
            console.log('res.locals.route',res.locals.route);
            const multer = require("multer");
            // Set storage engine
            const storage = multer.diskStorage({
              destination: res.locals.route,
              filename: function (req, file, callback) {
                callback(
                  null,
                  file.originalname.split(".")[0] +
                    "-viz" +
                    Date.now() +
                    path.extname(file.originalname)
                );
              },
            });
    
            // Initialize upload
            res.locals.upload = multer({
              storage: storage,
              limits: { fileSize: 100000000000 }, // 10MB
              fileFilter: function (req, file, callback) {
                checkFileType(file, callback);
              },
            }).array(args.filename); 
            next();
          } catch (error) {
            response.message = "Error: Upload error!";
            res.json(response);
          }
        };
        function checkFileType(file, callback) {
          console.log("called this func");
          const filetypes = /jpeg|jpg|png|gif|mp4|docs|pdf/; // Allowed file extensions
          const extname = filetypes.test(
            path.extname(file.originalname).toLowerCase()
          );
          const mimetype = filetypes.test(file.mimetype);
          console.log(file.originalname, "filename#");
          if (mimetype && extname) {
            return callback(null, true);
          } else {
            return callback("Error: File type should be image!");
          }
        }
      } ,
      profileFolderManager: (args={privacy}) =>(req, res, next) => {
        let session = res.locals.jwtUSER,
          userId = session.uid;
        let response = {
          message: "Something went wrong!",
          status: 401,
          authorization:true,
          data: {},
        };
        try {
          const userFolderPath = [
            // __dirname,
            args.privacy?"private":"public",
            "files",
            userId
          ]
          
          pathToCreate = "./";
          for (const path in userFolderPath) {
            pathToCreate += userFolderPath[path]+'/'
            if (!fs.existsSync(pathToCreate)) {
              // User folder does not exist, create it
              fs.mkdirSync(pathToCreate);
            }
          }
          res.locals.route = './'+userFolderPath.join('/')+'/';
          next();
        } catch (e) {
          console.log(e);
          response.message = "Profile upload failed,try again later!";
          return res.status(200).json(response);
        }
      }  
}