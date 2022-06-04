const mongoose = require('mongoose');
const validator = require('validator')

// / the 'Task' parameter we have passed
// mongo ose takes it in lowercase and pluralises it for Collection name in db
const User = mongoose.model('User', {
	name: {
		type: String,
        required: true,
        trim: true
	},
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value))
                throw new Error('Email is invalid')
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value){
            if(value.toLowerCase().includes('password'))
                throw new Error('password cannot contain "password"')
        }


    },
	age: {
		type: Number,
        default: 0,
        validate(value){
            if(value < 0){
                throw new Error('Age must be a positive Number')
            }
        }
	},
});

module.exports = User