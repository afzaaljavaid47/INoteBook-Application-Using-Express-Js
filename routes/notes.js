var express = require('express');
var router = express.Router();
var notesModel=require('../models/Notes');
var getUserInfo=require('../middlewares/getUserInfo');
const {body,validationResult}=require('express-validator');
var mongoose=require("mongoose");

mongoose.connect("mongodb+srv://afzaal:47545612@cluster0.5f4gt.mongodb.net/notes", { useNewUrlParser: true })
.catch((error) => console.error(error));
mongoose.connection.on("connected", () => {
  console.log("connected to mongo");
});


router.get('/getNotes',getUserInfo,async (req,res)=>{
    try {
        var allNotes=await notesModel.find({user:req.userID});
        res.status(200).json({allNotes});
    } catch (error) {
        res.status(500).json({messsage:"get notes error",error:error.message});
    }
})

router.post('/addnote',[
    body("title","Title is required").exists(),
    body("title","Title should be greater than 10 characters").isLength({min:10}),
    body("description","Description is required").exists(),
    body("description","Description should be greater than 10 characters").isLength({min:10}),
],getUserInfo,async (req, res, )=> {
  var error=validationResult(req);
  if(!error.isEmpty()){
    res.status(400).json({error:error.array()});
  }
  try { 
    const notes=new notesModel({
        user:req.userID,
        title:req.body.title,
        description:req.body.description,
        label:req.body.label
    })
    const addNote=await notes.save();
    res.status(200).json({message:"Note added successfully!",noteBody:notes});

  } catch (error) {
    res.status(500).json({error:error.message});
  }
});


router.put("/updateNote/:id",[ 
  body("title","Title is required").exists(),
  body("title","Title should be greater than 10 characters").isLength({min:10}),
  body("description","Description is required").exists(),
  body("description","Description should be greater than 10 characters").isLength({min:10})
],getUserInfo,async (req,res)=>{
  try {
    const {title,description,label}=req.body;
    const newNote={};
    if(title){newNote.title=title}
    if(description){newNote.description=description}
    if(label){newNote.label=label}
    console.log("New Note",newNote);
  let isNoteExists=await notesModel.findById({_id:req.params.id});
  console.log("Note Id:",isNoteExists.user.toString())
  console.log("User Id",req.userID)
  if(!isNoteExists){
    res.status(401).send("Note not exist in the database");
  }
  if(isNoteExists.user.toString()!==req.userID){
    res.status(401).json({error:"Unauthorized 401"});
  }
  isNoteExists=await notesModel.findByIdAndUpdate({_id:req.params.id},{$set:newNote},{new:true});
  res.status(200).json({isNoteExists})
  } catch (error) {
    res.status(500).json({error:error.message});
  }
})

router.delete("/deleteNote/:id",getUserInfo,async (req,res)=>{
  try {
  let isNoteExists=await notesModel.findById({_id:req.params.id});
  if(!isNoteExists){
    res.status(401).send("Note not exist in the database");
  }
  if(isNoteExists.user.toString()!==req.userID){
    res.status(401).json({error:"Unauthorized 401"});
  }
  isNoteExists=await notesModel.findByIdAndDelete({_id:req.params.id});
  res.status(200).json({isNoteExists})
  } catch (error) {
    res.status(500).json({error:error.message});
  }
})


module.exports = router;