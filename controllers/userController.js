const { validateUserId } = require("../helpers/validation");
const User = require('../models/userModel')

module.exports = {
    getProfile:async (req,res) => {
        let response = {
            message: "Something went wrong, please try again!",
            status: 401,
            authorization: true,
            data: {},
          };
          try {
           let uid = validateUserId(req.params.id);
             let userData = await User.findById(uid)
             userData.password = undefined;
             response.message = "User data retrieved successfully!";
             response.status = "ok";
             response.data = { userData };
             res.status(200).json(response);
          } catch (e) {
            console.log(e);
    response.message = "Something went wrong, please try again later!";
    res.status(200).json(response);
          }
    }
}