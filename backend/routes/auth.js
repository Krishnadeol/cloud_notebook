const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
// for encrypting the password we use bcrypt for salt generation.
const bcrypt = require('bcrypt');
const saltRounds = 10;
const User = require('../models/User');
var jwt = require('jsonwebtoken');
const fetchUser = require('../middleware/fetchUser');
const JWT_SECRET="alw@ys";



router.post('/', [    
// validating the name ,email and password.
  body('name', 'Enter a valid name').isLength({ min: 4 }),
  body('email', 'Enter a valid Email').isEmail(),
  body('password', 'Password must have at least 5 characters').isLength({ min: 5 }),
], async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
// checking for non unique email.

try{
let user=await User.findOne({email:req.body.email})

if(user){
    return res.status(400).json({message:"this user already exists"});
}

const myPass=req.body.password;

// these are returning promises . Hence we should use await . here we encypting the password
const salt =  bcrypt.genSaltSync(saltRounds);
const hash =  bcrypt.hashSync(myPass, salt);


user= await User.create({
    name: req.body.name,
    password: hash,
    email: req.body.email,
  })
   
  const data={
    user:{
        id:user.id
    }
  }

  const token=jwt.sign(data,JWT_SECRET);
  res.json({token})

} catch(error){
    console.error("something went wrong")
    res.status(500).json({error:"some thing is wrong"})
}
});


router.post('/login', [    
  // validating the name ,email and password.
    body('email', 'Enter a valid Email').isEmail(),
    body('password', 'Password should not be blank').exists(),
  ], async (req, res) => {
  
    // CHECKING FOR INFORMATION ENTERED BY THE USER
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
   
    try{

      //  destructuring of ther equest
      const {email,password}=req.body;
      
      let user=await User.findOne({email})
      if(!user){
          return res.status(400).json({message:"Such user does not exists"});
      }

   
      const passCompare=await bcrypt.compare(password,user.password);
      if(!passCompare)
      {
        res.status(400).json({error:"Please enter the correct credetials"});
      }
      const data={
        user:{
            id:user.id
        }
      }
    
      const token=jwt.sign(data,JWT_SECRET);
      res.json({token})
      
    }catch(error){
      console.error("something went wrong")
      res.status(500).json({error:"some thing is wrong"})
    }

  })


// for obtaining the user data after correct login 
router.post('/getUser',fetchUser,async (req,res)=> {
  try{
const userId =req.user.id;
const user=await User.findById(userId).select("-password");
res.status(200).json(user);
}catch(error){
  console.error("something went wrong")
  res.status(500).json({error:"some thing is wrong"})
}
})
  
module.exports = router;
