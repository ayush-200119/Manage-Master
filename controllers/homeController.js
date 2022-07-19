const express=require("express");
const router=express.Router();
const Student=require(__dirname+"/../models/studentSchema.js");
const Todo=require(__dirname+"/../models/todoSchema.js");

router.get("/",function(req,res)
{
    res.render("home",{isLoggedIn:false});
});

router.get("/:userid",function(req,res){
    const id=req.params.userid;
    res.render("home",{isLoggedIn:true,userid:id});
});

async function getTodos(uid)
{
    let currTodos=await Student.findOne({id:uid}).populate("todos");
    // console.log(currTodos.todos);
    return currTodos.todos;
}

router.get("/:userid/todos",async function(req,res){
    const uid=req.params.userid;
    let currTodos=await getTodos(uid);
    // console.log(currTodos);
    res.render("todos",{todos:currTodos,userid:uid});
});

router.post("/:userid/todos",function(req,res){
    const uid=req.params.userid;
    const currTitle=req.body.todotitle;
    const currTodo=new Todo({
        title:currTitle,
        checklist:[]
    });
    
    //updating the database of the current user and redirecting to the required route
    currTodo.save().then( todo =>{
            console.log("Todo created");
            Student.findOneAndUpdate({id:uid},{$push:{todos:todo._id}},function(err){
                if(!err)
                    console.log("Successfully updated");
    })});

    res.redirect(`/${uid}/todos/${currTitle}`);
});

//individual to-do

async function getTodo(uid,title)
{
    let currStudent=await Student.findOne({id:uid}).populate("todos");
    let currTodo=currStudent.todos.find((todo)=>{return todo.title===title});

    return currTodo;
}

router.get("/:userid/todos/:todo",async function(req,res){
    //find the user with the given id and get the todo list and find the required to-do from it
    const uid=req.params.userid;
    const todoTitle=req.params.todo;

    let temp=["Work","Sleep","Code"];
    let currTodo=await getTodo(uid,todoTitle);
    res.render("todo",{userid:uid,todo:currTodo});

});

router.post("/:userid/todos/:todo",async function(req,res){
    
    const operation=req.body.operation;
    const uid=req.params.userid;
    const todoTitle=req.params.todo;
    const todo=req.body.todo;

    const currTodo=await getTodo(uid,todoTitle);
    const currTodoId=currTodo._id;
    if(operation==="#")
    {
        Todo.findOneAndUpdate({_id:currTodoId},{$push:{checklist:todo}},function(err){
            if(!err)
            console.log("Successfully updated");
        });
    }
    else
    {
        console.log("In the deletion section");
        console.log(todoTitle);
        Todo.updateOne({_id:currTodoId},{$pull:{checklist:operation}},{ new: true },function(err){
            if(!err)
            console.log("Successfully deleted");
        });
    }

    res.redirect(`/${uid}/todos/${todoTitle}`);
});

router.get("/:userid/notes",function(req,res){
    res.render("notes");
});

router.get("/:userid/record",function(req,res){
    res.render("record");
});

router.get("/:userid/logout",function(req,res){
    res.redirect("/");
});

module.exports=router;