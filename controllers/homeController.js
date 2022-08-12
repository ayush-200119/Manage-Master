const express=require("express");
const multer=require("multer"); 
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, __dirname+'/../uploads/');
    },
    filename: function (req, file, cb) {
      const fileName = req.params.userid+"-"+file.originalname;
      cb(null, fileName);
    }
});
const upload = multer({ storage:storage });
const router=express.Router();
const Student=require(__dirname+"/../models/studentSchema.js");
const {Todo,todoSchema}=require(__dirname+"/../models/todoSchema.js");
const Note=require(__dirname+"/../models/noteSchema.js");

router.get("/",function(req,res)
{
    res.render("home",{isLoggedIn:false});
});

router.get("/:userid",function(req,res){
    const id=req.params.userid;
    res.render("home",{isLoggedIn:true,userid:id});
});


// ******************Todos Controller **********************


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
    if(req.body.hasOwnProperty("todotitle"))
    {
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
    }
    
    const objId=req.body.delete;
    Todo.deleteOne({_id:objId},function(err)
    {
        if(!err)
            console.log("Successfully deleted");
    });

    //need to work on this part!
    todoSchema.post("remove", document => {
        const todoId = document._id;
        Student.find({ todos: { $in: [todoId] } }).then(students => {
          Promise.all(
            students.map(student =>
              Student.findOneAndUpdate(
                student._id,
                { $pull: { todos: todoId } },
                { new: true }
              )
            )
          );
        });
      });

    res.redirect(`/${uid}/todos`);
    
    
});

//************************Todo-Controller ************************************

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

    let currTodo=await getTodo(uid,todoTitle);
    res.render("todo",{userid:uid,todo:currTodo});

});

router.post("/:userid/todos/:todo",async function(req,res){
    
    const uid=req.params.userid;
    const todoTitle=req.params.todo;

    const currTodo=await getTodo(uid,todoTitle);
    const currTodoId=currTodo._id;

    console.log(req.body);

    if(req.body.hasOwnProperty("add"))
    {
        let todo=req.body.todo;
        Todo.findOneAndUpdate({_id:currTodoId},{$push:{checklist:todo}},function(err){
            if(!err)
            console.log("Successfully updated");
        });
    }
    else if(req.body.hasOwnProperty("delete"))
    {
        let delTodo=req.body.delete;
        Todo.updateOne({_id:currTodoId},{$pull:{checklist:delTodo}},{ new: true },function(err){
            if(!err)
            console.log("Successfully deleted");
        });
    }
    else
    {
        //clear the checklist of the todo
        let objId=req.body.clear;
        Todo.updateOne({_id:objId},{$set:{checklist:[]}},function(err){
            if(!err)
            console.log("Successfully deleted");
        });
    }

    res.redirect(`/${uid}/todos/${todoTitle}`);
});



// **********************Notes Controller ************************************

async function getNotes(uid)
{
    let student=await Student.findOne({id:uid}).populate("notes");
    return student.notes;
}

router.get("/:userid/notes",async function(req,res){
    const uid=req.params.userid;
    let currNotes=await getNotes(uid);
    res.render("notes",{notes:currNotes,userid:uid});
});

router.post("/:userid/notes",function(req,res){
    const uid=req.params.userid;
    if(req.body.hasOwnProperty('notetitle'))
    {
        let currTitle=req.body.notetitle;
        let currNote =new Note({
            title:currTitle,
            content: ""
        });

        currNote.save().then(note=>{
            Student.updateOne({id:uid},{$push:{notes:note._id}},function(err){
                if(!err)
                console.log("Note pushed successfully");
            });
        });

        res.redirect(`/${uid}/notes/${currTitle}`);
    }
    
    const delObjId=req.body.delete;
    Note.deleteOne({_id:delObjId},function(err){
        if(!err)
        console.log("Successfully deleted");
    });

    Student.updateOne({id:uid},{$pull:{notes:delObjId}},function(err){
        if(!err)
        console.log("Deleted Successfully from students");
    });

    res.redirect(`/${uid}/notes`);
});

// **********************Note Controller ************************************

async function getNote(uid,title)
{
    let currStudent=await Student.findOne({id:uid}).populate("notes");
    let currNote=currStudent.notes.find((note)=>{return note.title===title});

    return currNote;
}

router.get("/:userid/notes/:title",async function(req,res){
    const uid=req.params.userid;
    const currTitle=req.params.title;

    let currNote=await getNote(uid,currTitle);
    res.render("note",{note:currNote,userid:uid});
});

router.post("/:userid/notes/:title",async function(req,res){
    const uid=req.params.userid;

    console.log(req.body);
    const currTitle=req.body.title;
    const currContent=req.body.content;

    console.log(currTitle,currContent);

    let currNote=await getNote(uid,currTitle);
    const currNoteId=currNote._id;

    Note.updateOne({_id:currNoteId},{$set:{title:currTitle,content:currContent}},function(err){
        if(!err)
        console.log("Successfully Updated");
    });

    res.redirect(`/${uid}/notes/${currTitle}`);
});

//*************************Records **********************//

router.get("/:userid/records",function(req,res){
    const uid=req.params.userid;
    res.render("records",{userid:uid});
});

router.get("/:userid/records/create",function(req,res){
    const uid=req.params.userid;
    res.render("record",{userid:uid,src:'C:\\Users\\HP\\Desktop\\SMA\\uploads\\n25aqol5quh3ff-check.mp3'});
});

router.post("/:userid/records/create",upload.single('recording'),function(req,res){
    console.log(req.file);
    console.log(req.body);
    res.send("Received");
});

router.get("/:userid/logout",function(req,res){
    res.redirect("/");
});

module.exports=router;