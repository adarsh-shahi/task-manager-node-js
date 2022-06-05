const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    }
})

userSchema.pre('save', async function(next) {
    console.log('task saving middleware');
    next()
})

const Task = mongoose.model('Task', userSchema)

module.exports = Task