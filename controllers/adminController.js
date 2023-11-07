const User = require('../models/userModel')

module.exports = {
    getUsers : async (req,res) => {
        let response = {
            message: "Something went wrong,user list retrive failed,try again later!",
            status: 401,
            authorization: true,
            data: {},
          };
          try {
            let uList = await User.find({}).select({password:0})
            response.message = `User list retrieved successfully!`;
            response.status = 'ok';
            response.data = {uList}
            return res.status(200).json(response)
          } catch (error) {
            console.log(error);
            response.message = "Something went wrong,user list retrieve failed,try again later!"
            return res.status(200).json(response)
          }
    }
}