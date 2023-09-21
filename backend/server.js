const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const todoRoutes = express.Router();
const PORT = 4000;

let Todo = require('./todo.model');

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/todos', { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
})

todoRoutes.route('/').get(async function (req, res) {
    try {
        const todos = await Todo.find();
        res.json(todos);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});


todoRoutes.route('/:id').get(async function(req, res) {
    let id = req.params.id;
    try {
        const todos = await Todo.findById(id);
        res.json(todos);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

todoRoutes.route('/update/:id').post(async function (req, res) {
    try {
        const todo = await Todo.findById(req.params.id);
        if (!todo)
            res.status(404).send("Data is not found");
        else {
            todo.todo_description = req.body.todo_description;
            todo.todo_responsible = req.body.todo_responsible;
            todo.todo_priority = req.body.todo_priority;
            todo.todo_completed = req.body.todo_completed;

            await todo.save();
            res.json('Todo updated!');
        }
    } catch (err) {
        console.error(err);
        res.status(400).send("Update not possible");
    }
});


todoRoutes.route('/add').post(function(req, res) {
    let todo = new Todo(req.body);
    todo.save()
        .then(todo => {
            res.status(200).json({'todo': 'todo added successfully'});
        })
        .catch(err => {
            res.status(400).send('adding new todo failed');
        });
});

todoRoutes.route('/delete/:id').delete(async function (req, res) {
    try {
        const todo = await Todo.findByIdAndRemove(req.params.id);
        if (!todo)
            res.status(404).send("Data is not found");
        else
            res.json('Todo deleted!');
    } catch (err) {
        console.error(err);
        res.status(400).send("Delete not possible");
    }
});

app.use('/todos', todoRoutes);

app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});