const { default: mongoose } = require("mongoose");
const mongooose = require("mongoose");
const { stringify } = require("querystring");

const noteSchema = new mongoose.Schema({
    userid:{type:String , required:true},
    title:{type:String,required:true},
    content:{type:String}
});

const Note = mongoose.model("Note",noteSchema);

module.exports=Note;