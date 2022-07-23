const { default: mongoose } = require("mongoose");
const mongooose = require("mongoose");
const { stringify } = require("querystring");
// const todo=require("todoSchema.js");
// const note=require("noteSchema.js");

const studentSchema = new mongoose.Schema({
    id:{type:String , required:true},
    email:{type:String, required:true},
    password:{type:String, required:true},
    todos:[{type:mongoose.Schema.Types.ObjectId,ref:"Todo"}],
    notes:[{type:mongoose.Schema.Types.ObjectId,ref:"Note"}],
});

const Student = mongoose.model("Student",studentSchema);

module.exports=Student;