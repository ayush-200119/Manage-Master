const express=require("express");
const router=express.Router();
const Student=require(__dirname+"/../models/studentSchema.js");

router.get("/",function(req,res)
{
    res.render("home",{isLoggedIn:false});
});

router.get("/:userid",function(req,res){
    const id=req.params.userid;
    res.render("home",{isLoggedIn:true,userid:id});
});

router.get("/:userid/todos",function(req,res){
    const uid=req.params.userid;
    Student.findOne({id:uid},function(err,foundStudent){
        if(!err)
        {
            res.render("todos",{todos:foundStudent.todos});
        }
    });
});

router.get("/:userid/notes",function(req,res){
    res.render("notes");
});

router.get("/:userid/record",function(req,res){
    res.render("record");
});

module.exports=router;