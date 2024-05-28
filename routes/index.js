var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const UserModel=require('../models/User');
const {body,validationResult}=require('express-validator');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var getUserInfo=require("../middlewares/getUserInfo");

mongoose.connect("mongodb+srv://afzaal:47545612@cluster0.5f4gt.mongodb.net/notes", { useNewUrlParser: true })
.catch((error) => console.error(error));
mongoose.connection.on("connected", () => {
  console.log("connected to mongo");
});
router.post("/createUser",[
  body("Name",'Please enter a valid name').isLength({min:3}),
  body("Email","Please enter a valid email").isEmail()
],async function (req, res, next) {
  const errors=validationResult(req);
  if(!errors.isEmpty())
  {
     res.status(400).json({errors:errors.array()})
  }
  try {  
  const findUser=await UserModel.findOne({UserName:req.body.UserName});
  if(findUser)
  {
    console.log("User already exists");
    res.status(200).json({success:false,message:"user already exists with this username"});
  }
  var salt = bcrypt.genSaltSync(10);
  var newPass=await bcrypt.hash(req.body.Password,salt);
  console.log(salt);
  var token = await jwt.sign({ 
    Name:req.body.Name,
    UserName:req.body.UserName,
    Email:req.body.Email,
    Password:newPass,
    Token:req.Token
  }, 'szexdrcftgvhbjnrtfyguhdcfvgbhjdftgvhbjkdfcgvhbj897465');
  const user=new UserModel({
    Name:req.body.Name,
    UserName:req.body.UserName,
    Email:req.body.Email,
    Password:newPass,
    Token:token
  })

  await user.save().then(() => console.log('User Save to DB')).catch((err)=>{
    console.log(err.message);
  });
  res.send({success:true,message:"User created successfully",token:token});
} catch (error) {
    res.status(500).json({success:false,message:"Something went wrong",message:error});
}

});

router.post("/login",[
  body('UserName',"Please enter valid user name").isLength({min:3}),
  body('Password',"Please enter valid password").isLength({min:6})
],async (req,res)=>{
  const errors=validationResult(req);
  var status=false;
  if(!errors.isEmpty())
  {
      return res.status(400).json({status:false,message:"User name or password does not meet basic requirements",message:errors.array()})
  }
  try {
    let FindUser=await UserModel.findOne({UserName:req.body.UserName});
    console.log(FindUser);
    if(!FindUser){
    return res.status(400).json({status:false,message:"Invalid user name or password"});
    }
    const comparePassword=bcrypt.compareSync(req.body.Password,FindUser.Password);
    if(!comparePassword){
      return res.status(400).json({status:false,message:"Invalid user name or password"});
    }
    const UserData={
      userID:FindUser.id
    }
    const userToken=jwt.sign(UserData,"szexdrcftgvhbjnrtfyguhdcfvgbhjdftgvhbjkdfcgvhbj897465");
    res.status(200).json({status:true,userToken});
      
  } catch (error) {
    return res.status(500).json({status:false,message:error.message});
  }
})

router.post("/getUser",getUserInfo,async (req,res)=>{
  try {
    const user=await UserModel.findById({_id:req.userID});
    if(!user)
    {
      res.status(401).json({error:"401 unauthorized"});
    }
    res.status(200).json({message:"Login successfully!",user});
  } 
  catch (error) {
    res.status(500).json({error:"Internal Server Error"});
  }
})

module.exports = router;
