const express=require("express");
const bcrypt = require('bcrypt');
const mongoose=require("mongoose");
const Student = require(__dirname+"/../models/studentSchema.js"); 
const router=express.Router();
const notifier=require('node-notifier');

//diufwigf

router.get("/",function(req,res){
    res.render("login");
});

router.post("/",function(req,res){
    const mail=req.body.email;
    const password=req.body.password;

    Student.findOne({email:mail},function(err,foundStudent){
        if(!err)
        {
            if(!foundStudent)
            {    
                notifier.notify({
                    title:"Login status",
                    message:"The entered email does not exits!",
                    wait:true,
                    timeout:15,
                    actions:["Try again","Register"]
                },
                function(err,response,metadata){
                    console.log(response);
                    if(response==="register")
                    {
                        res.redirect("/signup");
                    }
                    else
                    {
                        res.redirect("/login");
                    }
                }
                );
            }
            else{
            bcrypt.compare(password, foundStudent.password, function(err, result) {
                if(!err)
                {
                    if(result===true)
                    {
                        res.redirect(`/${foundStudent.id}`);
                    }
                    else
                    {
                        notifier.notify({
                            title:"Login status",
                            message:"Password Incorrect!",
                            wait:true,
                            timeout:15,
                            actions:["Try again"]
                        },
                        function(err,response,metadata){
                            res.redirect("/login");
                        }
                        );
                    }
                }
                else
                {
                    console.log(err);
                }
            });
            }
        }
        else
        {
            console.log(err);
        }
    });
});

module.exports=router;