const mongoose = require('mongoose');

// Define Task Schema
const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true
        },
        description: {
            type: String,
            default: ""
        },
        completed: {
            type: Boolean,
            default: false
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        priority: {
            type: String,
            enum: {
                values: ["low", "medium", "high"],
                message: "Priority must be either low, medium, or high"
            },
            default: "medium"
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Task must belong to a user']
        }
    },
    {
        versionKey: false
    }
);

// Pre-save hook to trim title (compatible with Mongoose version)
taskSchema.pre('save', function () {
    if (this.title && typeof this.title === 'string') {
        this.title = this.title.trim();
    }
});

// Compile and export Task model
const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
