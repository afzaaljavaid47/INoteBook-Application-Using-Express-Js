const mongoose=require('mongoose');

const notesSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    label:{
        type:String
    },
    date:{
        type: Date,
        default:Date.now()
    }
})

module.exports=mongoose.model("notes",notesSchema);