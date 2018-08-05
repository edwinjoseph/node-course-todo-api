const mongoose = require('mongoose');

const Todo = mongoose.model('todo', {
    text: {
        type: String,
        required: true,
        minLength: 1,
        trim: true,
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number,
        default: new Date().getTime()
    }
});

module.exports = Todo;
