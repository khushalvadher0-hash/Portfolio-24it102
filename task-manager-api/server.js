require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Task = require('./models/Task');
const User = require('./models/User');
const authMiddleware = require('./middleware/auth');
const {
    cache,
    getTaskListKey,
    getTaskSingleKey,
    recordHit,
    recordMiss,
    invalidateUserTasks,
    getStats
} = require('./utils/cache');

// Practical 10: Import shared EventEmitter and register listeners once at startup
const taskEvents = require('./events');
require('./listeners');

const app = express();


// Configure CORS for React frontend (allow Authorization header)
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware: Parse JSON request body
app.use(express.json());

// Global request logging middleware (from Practical 4)
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
    next();
});

// Middleware: Validate JSON Content-Type for POST and PUT
app.use(['/tasks', '/register', '/login'], (req, res, next) => {
    if (['POST', 'PUT'].includes(req.method) && !req.is('application/json')) {
        return res.status(400).json({
            error: 'Content-Type must be application/json'
        });
    }
    next();
});

// Helper middleware: Validate MongoDB ObjectId
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
// Authentication Routes (Practical 7)
// ------------------------------------------------------------

// Helper for email regex validation
const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

// 1. POST /register - Register a new user
app.post('/register', async (req, res, next) => {
    try {
        const { email, password } = req.body || {};

        if (!email || typeof email !== 'string' || !email.trim()) {
            return res.status(400).json({
                error: 'Validation failed',
                details: ['Email is required and must be a valid email string']
            });
        }

        const normalizedEmail = email.trim().toLowerCase();
        if (!EMAIL_REGEX.test(normalizedEmail)) {
            return res.status(400).json({
                error: 'Validation failed',
                details: ['Please provide a valid email address']
            });
        }

        if (!password || typeof password !== 'string' || password.length < 6) {
            return res.status(400).json({
                error: 'Validation failed',
                details: ['Password is required and must be at least 6 characters long']
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(409).json({
                error: 'A user with this email already exists'
            });
        }

        // Hash password with bcryptjs (10 salt rounds)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            email: normalizedEmail,
            password: hashedPassword
        });

        // Return HTTP 201 without returning password hash
        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: newUser._id,
                email: newUser.email,
                createdAt: newUser.createdAt
            }
        });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({
                error: 'A user with this email already exists'
            });
        }
        next(err);
    }
});

// 2. POST /login - Authenticate user and issue JWT
app.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body || {};

        if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
            return res.status(400).json({
                error: 'Email and password are required'
            });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            // Never reveal whether user exists or password was wrong
            return res.status(401).json({
                error: 'Invalid email or password'
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                error: 'Invalid email or password'
            });
        }

        if (!JWT_SECRET) {
            console.error('FATAL ERROR: JWT_SECRET is not configured.');
            return res.status(500).json({
                error: 'Server configuration error'
            });
        }

        // Generate JWT token with 1h expiration
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                email: user.email
            }
        });
    } catch (err) {
        next(err);
    }
});

// 3. GET /me - Return authenticated user's ID and email
app.get('/me', authMiddleware, async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({
                error: 'User not found'
            });
        }

        res.status(200).json({
            id: user._id,
            email: user.email,
            createdAt: user.createdAt
        });
    } catch (err) {
        next(err);
    }
});

// ------------------------------------------------------------
// Cache Debug & Performance Monitoring Route (Practical 9)
// ------------------------------------------------------------
app.get('/cache/stats', (req, res) => {
    res.status(200).json(getStats());
});

// ------------------------------------------------------------
// Protected CRUD Routes for Tasks (Scoped to req.user.id)
// ------------------------------------------------------------

// 1. GET /tasks - Retrieve all tasks for the authenticated user (Cached with node-cache)
app.get('/tasks', authMiddleware, async (req, res, next) => {
    try {
        const cacheKey = getTaskListKey(req.user.id);
        const bypassCache = req.headers['x-bypass-cache'] === 'true';

        // Check cache hit (unless explicitly bypassed via header for benchmarking)
        if (!bypassCache && cache.has(cacheKey)) {
            recordHit();
            const cachedTasks = cache.get(cacheKey);
            res.setHeader('X-Cache', 'HIT');
            return res.status(200).json(cachedTasks);
        }

        // Cache miss: query MongoDB
        recordMiss();
        const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });

        // Store in cache for 60 seconds (stdTTL)
        cache.set(cacheKey, tasks);
        res.setHeader('X-Cache', 'MISS');

        res.status(200).json(tasks);
    } catch (err) {
        next(err);
    }
});

// 2. GET /tasks/:id - Retrieve a single task by ID (Cached with node-cache)
app.get('/tasks/:id', authMiddleware, validateObjectId, async (req, res, next) => {
    try {
        const cacheKey = getTaskSingleKey(req.user.id, req.params.id);
        const bypassCache = req.headers['x-bypass-cache'] === 'true';

        // Check cache hit
        if (!bypassCache && cache.has(cacheKey)) {
            recordHit();
            const cachedTask = cache.get(cacheKey);
            res.setHeader('X-Cache', 'HIT');
            return res.status(200).json(cachedTask);
        }

        // Cache miss: query MongoDB
        recordMiss();
        const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
        if (!task) {
            return res.status(404).json({
                error: 'Task not found'
            });
        }

        // Store in cache
        cache.set(cacheKey, task);
        res.setHeader('X-Cache', 'MISS');

        res.status(200).json(task);
    } catch (err) {
        next(err);
    }
});

// 3. POST /tasks - Create a new task owned by the authenticated user
app.post('/tasks', authMiddleware, async (req, res, next) => {
    try {
        const { title, description, completed, priority } = req.body || {};

        // Validation for title
        if (title === undefined || typeof title !== 'string' || !title.trim()) {
            return res.status(400).json({
                error: 'Validation failed',
                details: ['Title is required and must be a non-empty string']
            });
        }

        // Validation for completed
        if (completed !== undefined && typeof completed !== 'boolean') {
            return res.status(400).json({
                error: 'Validation failed',
                details: ['Completed must be a boolean (true or false)']
            });
        }

        // Validation for priority
        const validPriorities = ['low', 'medium', 'high'];
        if (priority !== undefined && !validPriorities.includes(priority)) {
            return res.status(400).json({
                error: 'Validation failed',
                details: ['Priority must be either low, medium, or high']
            });
        }

        const newTask = await Task.create({
            title: title.trim(),
            description: typeof description === 'string' ? description.trim() : '',
            completed: Boolean(completed),
            priority: priority || 'medium',
            user: req.user.id
        });

        // Practical 9: Invalidate user's task list cache on successful write
        invalidateUserTasks(req.user.id);

        // Practical 10: Log API response timestamp and send HTTP 201 response first
        const apiResponseTimestamp = new Date().toISOString();
        console.log(`[API] Task created; response sent at: ${apiResponseTimestamp}`);
        res.status(201).json(newTask);

        // Defer event emission using setImmediate to guarantee non-blocking response delivery
        setImmediate(() => {
            taskEvents.emit('task-created', newTask);
        });
    } catch (err) {
        next(err);
    }
});

// 4. PUT /tasks/:id - Update an existing task (only if owned by authenticated user)
app.put('/tasks/:id', authMiddleware, validateObjectId, async (req, res, next) => {
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

        const validPriorities = ['low', 'medium', 'high'];
        if (priority !== undefined && !validPriorities.includes(priority)) {
            return res.status(400).json({
                error: 'Validation failed',
                details: ['Priority must be either low, medium, or high']
            });
        }

        const updatedTask = await Task.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            {
                ...(title !== undefined && { title: title.trim() }),
                ...(description !== undefined && { description: typeof description === 'string' ? description.trim() : description }),
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

        // Practical 9: Invalidate user's task list and individual task cache on successful write
        invalidateUserTasks(req.user.id, req.params.id);

        res.status(200).json(updatedTask);
    } catch (err) {
        next(err);
    }
});

// 5. DELETE /tasks/:id - Delete a task (only if owned by authenticated user)
app.delete('/tasks/:id', authMiddleware, validateObjectId, async (req, res, next) => {
    try {
        const deletedTask = await Task.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });

        if (!deletedTask) {
            return res.status(404).json({
                error: 'Task not found'
            });
        }

        // Practical 9: Invalidate user's task list and individual task cache on successful write
        invalidateUserTasks(req.user.id, req.params.id);

        res.status(200).json({
            message: 'Task deleted successfully',
            task: deletedTask
        });

        // Practical 10: Defer task-deleted event emission after response is returned
        setImmediate(() => {
            taskEvents.emit('task-deleted', deletedTask);
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
