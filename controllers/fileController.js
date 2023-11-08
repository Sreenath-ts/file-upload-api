
const s3 = require('../helpers/utils/s3.util'); 
const { DeleteObjectCommand,ListObjectsV2Command } = require('@aws-sdk/client-s3');

exports.uploadMultiple = (req, res) => {
  let response = {
    message: "Internal error detected while updating profile picture!",
    status: 401,
    authorization: true,
    data: {},
  };
  res.locals.upload(req, res, function (err) {
    if (err) {
        if(err.code ==  'LIMIT_FILE_SIZE'){
          response.message = 'File size limit exceeded. The maximum allowed file size is 5MB.' 
        }else{
          response.message = "Error: Invalid type of file!";
        }
      return res.json(response);
    }else{
      if (req.files == undefined) {
        response.message = "Error: No File Selected!";
        return res.json(response);
      }else{
        response.message = 'Files added successfully!!';
        response.status = 'ok';
        res.json(response);
      }
    }
  })
}

exports.deleteFile = async (req,res) => {
  try {
    const filename = req.params.filename;
    const command = new DeleteObjectCommand({ 
      Bucket: process.env.AWS_BUCKET, 
      Key: filename 
  });
  const response = await s3.send(command);
  res.json({message:'File deleted successfully!!!'})
  } catch (error) {
     console.log(error); 
     res.status(404).json({message:"Internal error,try again later"})
  }
}

exports.listFiles = async(req,res)=>{
  try {
   const command = new ListObjectsV2Command({Bucket:process.env.AWS_BUCKET})
    const response = await s3.send(command)
    const data = response.Contents.map(item => item.Key)
    res.json({message:"data fetched successfully",data})
  } catch (error) {
    res.status(404).json({message:"Resources not found"})
  }
}