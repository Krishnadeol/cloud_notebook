import mongoose from 'mongoose';
const { Schema } = mongoose;

const NotesSchema = new Schema({
   
    title:{
    type:string
   },

   description:{
    type: string,
    required :true
   },
 
   tag:{  
    type:string,
    default : "General"
   },

   date:{
    type:date,
    default: Date.now
   }
});
module.exports=mongoose.model('Notes',NotesSchema)