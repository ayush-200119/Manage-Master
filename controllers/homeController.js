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
            res.render("todos",{todos:foundStudent.todos,userid:uid});
        }
    });
});

router.post("/:userid/todos",function(req,res){
    const uid=req.params.userid;
    const currTitle=req.body.todotitle;
    const currTodo={title:currTitle,checklist:[]};
    
    //updating the database of the current user and redirecting to the required route
    Student.findOneAndUpdate({'student.id':uid},{$push:{todos:currTodo}},function(err){
        if(!err)
            console.log("Successfully updated");
    });
    res.redirect(`/${uid}/todos/${currTitle}`);
});

//individual to-do
router.get("/:userid/todos/:todo",function(req,res){
    //find the user with the given id and get the todo list and find the required to-do from it
    const uid=req.params.userid;
    const todoTitle=req.params.todo;

    function checkTitle(todo)
    {
        return todo.title===todoTitle;
    }

    Student.findOne({id:uid},function(err,foundStudent){
        if(!err)
        {
            const requiredTodo=foundStudent.todos.find(checkTitle);
            res.render("todo",{title:requiredTodo.title,checklist:requiredTodo.checklist});
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