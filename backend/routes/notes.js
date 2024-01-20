const express=require('express');
const router=express.Router();
const fetchUser = require('../middleware/fetchUser');
const Notes = require('../models/Notes');
const { body, validationResult } = require('express-validator');



// for getting all the notes 
router.get('/fetchAll',fetchUser,async (req,res)=>{
 try{
  const notes=await Notes.find({user:req.user.id});
   res.json(notes);
}catch(error){
  res.json({error});
}
})


// for adding a new note 
router.post('/addNote',fetchUser,[
body('title','Title should be  3-16 char long').isLength({min:3 ,max:16}),
body('description','description should be at least 5 char long').isLength({min:5})
],async (req,res)=>{
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
try{
  const {title,description,tag}=req.body;
  const note = new Notes({
    title,
    user: req.user.id, // Corrected this line
    description,
    tag,
    user: req.user.id
});

  const saved= await note.save();
  
  res.json(saved);
}catch(error){
  res.status(500).json({error})
}
})


// for updating note

router.put('/update/:id',fetchUser,async (req,res)=>{
  try{
   const {title,description,tag}=req.body

  const newNote= {};
  if(title) newNote.title=title;
  if(description) newNote.description=description
  if(tag) newNote.tag=tag

 let note=await Notes.findById(req.params.id);


 if(!note) res.status(404).json("note with id not available ") 
 if(note.user.toString()!==req.user.id) res.status(401).json("not authorised")

note = await Notes.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true});
res.json(newNote);
 }catch(error){
   res.json({error:error.message});
 }
 })
 
 
 router.delete('/delete/:id', fetchUser, async (req, res) => {
  try {
    let note = await Notes.findById(req.params.id);

    if (!note) {
      return res.status(404).json("Note with the specified id not available ");
    }

    // Check if the user is authorized to delete the note
    if (note.user.toString() !== req.user.id) {
      return res.status(401).json("Not authorized to delete this note");
    }

    // Delete the note
    note = await Notes.findByIdAndDelete(req.params.id);

    return res.json("Successfully deleted");
  } catch (error) {
    return res.json({ error: error.message });
  }
});
module.exports=router;