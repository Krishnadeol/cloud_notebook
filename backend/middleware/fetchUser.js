var jwt = require('jsonwebtoken');
const JWT_SECRET="alw@ys";

const fetchUser=(req,res,next)=>{

    // obtaining token 
const token=req.header('auth-token');
if(!token){
    res.status(401).json({error:"Please authenticate using a suitable token"})
}

try {
  // verifying token using secret jsonwebtoken library in Node.js, and its purpose is to check whether a given 
  //token is valid, unaltered, and has not expired.
const data=jwt.verify(token,JWT_SECRET);

// updating the request 
req.user=data.user;
next();   
} catch (error) {
    res.status(401).json({error:"Unidentified Token"})
}
}

module.exports=fetchUser;