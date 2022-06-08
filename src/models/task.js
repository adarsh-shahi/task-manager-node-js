
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    } 
}, {
	timestamps: true   // creates createdAt and upatedAt fields in DB
})


// userSchema.pre('save', async function(next) {
//     console.log('task saving middleware');
//     next()
// })

const Task = mongoose.model('Task', taskSchema)

module.exports = Task