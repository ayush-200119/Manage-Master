const express=require("express");
const mongoose=require("mongoose");
const bodyParser=require("body-parser");


//Initializations
const app=express();
app.set("view engine", "ejs");
app.use(express.static(__dirname+'/public'));
app.use(bodyParser.urlencoded({ extended: true }));


//Setting routes
app.listen(3000,()=>{
    console.log("Server is up and running");
});