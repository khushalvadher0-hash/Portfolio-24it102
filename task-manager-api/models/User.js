const mongoose = require('mongoose');

// Define User Schema
const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            trim: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
        },
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        versionKey: false
    }
);

// Compile and export User model
const User = mongoose.model('User', userSchema);

module.exports = User;
