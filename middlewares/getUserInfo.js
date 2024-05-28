var jwt=require("jsonwebtoken");


const getUserInfo=(req,res,next)=>{
   try {
    const token=req.header('auth-Token');
    if(!token)
    {
        res.status(401).json({error:"Invalid Token"});
    }
    const userDetail=jwt.verify(token,'szexdrcftgvhbjnrtfyguhdcfvgbhjdftgvhbjkdfcgvhbj897465');
    req.userID=userDetail.userID;
    next();
   } catch (error) {
    res.status(500).json({error:"Internal Server Error",message:error.message});
   }
}


module.exports=getUserInfo;