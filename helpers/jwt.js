const jwt = require('jsonwebtoken');

module.exports = {
    sign:(uData)=>{
        const jwtAccessSecret = process.env.JWT_ACCESS_SECRET_TOKEN;
        const jwtAccessToken = jwt.sign(uData, jwtAccessSecret, { expiresIn:'30d' }); //15 minutes
        return {
          token:{
            accessToken:jwtAccessToken
          },
          expire:{
            time:jwt.decode(jwtAccessToken).exp*1000,
            timeZone:Intl.DateTimeFormat().resolvedOptions().timeZone
          }
        }
    },
    verify:(req,res,next)=>{
      let apiRes = {
        status:401,
        message:'Login required!',
        authorization:false,
        data:{}
    }
      try{
       
      let jwtSecret = process.env.JWT_ACCESS_SECRET_TOKEN;
      let cookieToken =  req.headers.authorization;
      if (!cookieToken) {
          apiRes.message = 'Missing authorization token, please login now!'
        return res.status(200).json(apiRes);
      }
      cookieToken = cookieToken.split(' ')[1]
      try {
        const decoded = jwt.verify(cookieToken, jwtSecret);
        res.locals.jwtUSER = decoded;
        if(decoded) next()
        else {
          apiRes.message = 'Invalid token! please login again to avoid this error message!'
          res.status(200).json(apiRes);
        }
      } catch (err) {
          console.log(err);
          apiRes.message = 'Invalid token! please login again to avoid this error message!'
          res.status(200).json(apiRes);
      }

      }catch(e){
        console.log(e);
        apiRes.message = 'Something went wrong, please try again later!'
        return res.status(200).json(apiRes)
      }
      
  },
}