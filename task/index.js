const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// In-memory storage for tasks
let tasks = [];

// Task model
class Task {
    constructor(id, title, description, status) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.status = status;
    }
}

// Generate unique task ID
function generateTaskId() {
    return tasks.length + 1;
}

// Middleware
app.use(bodyParser.json());

// Create a new task
app.post('/tasks', (req, res) => {
    const { title, description, status } = req.body;
    const id = generateTaskId();
    const task = new Task(id, title, description, status);
    tasks.push(task);
    res.status(201).json(task);
});

// Get all tasks
app.get('/tasks', (req, res) => {
    res.json(tasks);
});

// Get a single task by ID
app.get('/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const task = tasks.find(task => task.id === id);
    if (!task) {
        res.status(404).json({ error: 'Task not found' });
    } else {
        res.json(task);
    }
});

// Update a task by ID
app.put('/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { title, description, status } = req.body;
    const index = tasks.findIndex(task => task.id === id);
    if (index === -1) {
        res.status(404).json({ error: 'Task not found' });
    } else {
        const updatedTask = { ...tasks[index], title, description, status };
        tasks[index] = updatedTask;
        res.json(updatedTask);
    }
});

// Delete a task by ID
app.delete('/tasks/id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = tasks.findIndex(task => task.id === id);
    if (index === -1) {
        res.status(404).json({ error: 'Task not found' });
    } else {
        tasks.splice(index, 1);
        res.sendStatus(204);
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong' });
});

// Start server
app.listen(PORT, () => {
    console.log("Server is running" )
});