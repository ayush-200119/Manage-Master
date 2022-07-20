const { default: mongoose } = require("mongoose");
const mongooose = require("mongoose");
const { stringify } = require("querystring");

const todoSchema = new mongoose.Schema({
    title:{type:String,required:true},
    checklist:{type:Array}
});

const Todo = mongoose.model("Todo",todoSchema);

module.exports={Todo,todoSchema};