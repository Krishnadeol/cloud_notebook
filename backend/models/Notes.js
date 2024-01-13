const mongoose = require('mongoose');
const { Schema } = mongoose;
const NotesSchema = new Schema({
   // for connecting notes with user id
    user:{
     type:mongoose.Schema.Types.ObjectId,
     ref: 'user'
   },
    title:{
    type:String
   },

   description:{
    type: String,
    required :true
   },
 
   tag:{  
    type:String,
    default : "General"
   },

   date:{
    type:Date,
    default: Date.now
   }
});
module.exports=mongoose.model('Notes',NotesSchema)