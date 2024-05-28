const mongoose=require('mongoose');

const UserSchema=new mongoose.Schema({
    Name:{
        type:String,
        required:true
    },
    UserName:{
        type:String,
        required:true,
    },
    Email:{
        type:String,
        required:true,
    },
    Password:{
        type:String,
        required:true
    },
    Token:{
        type:String
    }
})

const user=mongoose.model("User",UserSchema);
module.exports=user;