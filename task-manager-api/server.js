require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Task = require('./models/Task');

const app = express();

// Configure CORS for React frontend
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware: Parse JSON request body
app.use(express.json());

// Global request logging middleware (from Practical 4)
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
    next();
});

// Middleware: Validate JSON Content-Type for POST and PUT
app.use('/tasks', (req, res, next) => {
    if (['POST', 'PUT'].includes(req.method) && !req.is('application/json')) {
        return res.status(400).json({
            error: 'Content-Type must be application/json'
        });
    }
    next();
});

// Helper middleware: Validate MongoDO ObjectId
function validateObjectId(req, res, next) {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            error: 'Invalid task ID format. Must be a 24-character hexadecimal string'
        });
    }
    next();
}

// ------------------------------------------------------------
// CRUD Routes using Mongoose
// -----------------------------------------------------------

// 1. GET /tasks - Retrieve all tasks
app.get('/tasks', async (req, res, next) => {
    try {
        const tasks = await Task.find();
        res.status(200).json(tasks);
    } catch (err) {
        next(err);
    }
});

// 2. GET /tasks/:id - Retrieve a single task by ID
app.get('/tasks/:id', validateObjectId, async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({
                error: 'Task not found'
            });
        }
        res.status(200).json(task);
    } catch (err) {
        next(err);
    }
});

// 3. POST /tasks - Create a new task
app.post('/tasks', async (req, res, next) => {
    try {
        const { title, description, completed, priority } = req.body || {};

        // Explicit validation checks for beginner clarity
        if (title !== undefined && (typeof title !== 'string' || !title.trim())) {
            return res.status(400).json({
                error: 'Validation failed',
                details: ['Title is required and must be a non-empty string']
            });
        }

        if (completed !== undefined && typeof completed !== 'boolean') {
            return res.status(400).json({
                error: 'Validation failed',
                details: ['Completed must be a boolean (true or false)']
            });
        }


        const newTask = await Task.create({
            title,
            description,
            completed,
            priority
        });

        res.status(201).json(newTask);
    } catch (err) {
        next(err);
    }
});

// 4. PUT /tasks/:id - Update an existing task
app.put('/tasks/:id', validateObjectId, async (req, res, next) => {
    try {
        const { title, description, completed, priority } = req.body || {};

        if (
            title === undefined &&
            description === undefined &&
            completed === undefined &&
            priority === undefined
        ) {
            return res.status(400).json({
                error: 'Please provide at least one field to update (title, description, completed, priority)'
            });
        }


        if (title !== undefined && (typeof title !== 'string' || !title.trim())) {
            return res.status(400).json({
                error: 'Validation failed',
                details: ['Title must be a non-empty string']
            });
        }

        if (completed !== undefined && typeof completed !== 'boolean') {
            return res.status(400).json({
                error: 'Validation failed',
                details: ['Completed must be a boolean (true or false)']
            });
        }

        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            {
                ...(title !== undefined && { title: title.trim() }),
                ...(description !== undefined && { description }),
                ...(completed !== undefined && { completed }),
                ...(priority !== undefined && { priority })
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedTask) {
            return res.status(404).json({
                error: 'Task not found'
            });
        }

        res.status(200).json(updatedTask);
    } catch (err) {
        next(err);
    }
});

// 5. DELETE /tasks/:id - Delete a task
app.delete('/tasks/:id', validateObjectId, async (req, res, next) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);
        if (!deletedTask) {
            return res.status(404).json({
                error: 'Task not found'
            });
        }

        res.status(200).json({
            message: 'Task deleted successfully',
            task: deletedTask
        });
    } catch (err) {
        next(err);
    }
});

// -----------------------------------------------------------
// Undefined Routes and Error Handling Middleware
// -----------------------------------------------------------

// Undefined route handler
app.use((req, res, next) => {
    res.status(404).json({
        error: 'Route not found',
        path: req.originalUrl
    });
});

// Global error handling middleware (must be last)
app.use((err, req, res, next) => {
    console.error('Server Error:', err.message);

    if (res.headersSent) {
        return next(err);
    }

    // Malformed JSON request body
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({
            error: 'Invalid JSON request body'
        });
    }

    // Mongoose Validation Error
    if (err.name === 'ValidationError') {
        const details = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({
            error: 'Validation failed',
            details
        });
    }

    // Invalid MongoDB ObjectId (CastError)
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        return res.status(400).json({
            error: 'Invalid task ID format'
        });
    }

    // MongoDB duplicate key error
    if (err.code === 11000) {
        return res.status(400).json({
            error: 'Duplicate field value entered'
        });
    }

    // Default 500 Internal Server Error
    res.status(500).json({
        error: 'Internal server error'
    });
});

// ----------------------------------------------------------
// Database Connection & Server Initialization
// ----------------------------------------------------------
async function startServer() {
    if (!MONGO_URI) {
        console.error('FATAL ERROR: MONGO_URI is not defined in the .env file.');
        process.exit(1);
    }

    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('Successfully connected to MongoDB.');

        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('MongoDB Connection Failed! Server will not start.', error.message);
        process.exit(1);
    }
}

startServer();
