const { default: mongoose } = require("mongoose");
const mongooose = require("mongoose");
const { stringify } = require("querystring");

const studentSchema = new mongoose.Schema({
    id:{type:String , required:true},
    email:{type:String, required:true},
    password:{type:String, required:true},
});

const Student = mongoose.model("Student",studentSchema);

module.exports=Student;