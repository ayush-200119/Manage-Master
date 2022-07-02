const express=require("express");
const mongoose=require("mongoose");
const bodyParser=require("body-parser");

//Controllers
const loginController=require(__dirname+"/controllers/loginController.js");
const signupController=require(__dirname+"/controllers/signupController.js");

//Database connections
mongoose.connect("mongodb://localhost:27017/studentDB",{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

//Initializations
const app=express();
app.set("view engine", "ejs");
app.use(express.static(__dirname+'/public'));
app.use(bodyParser.urlencoded({ extended: true }));

//Acquiring Schema
const Student=require(__dirname+"/models/studentSchema.js");

//setting controllers
app.use("/login",loginController);
app.use("/signup",signupController);

//Setting routes
app.listen(3000,()=>{
    console.log("Server is up and running");
});