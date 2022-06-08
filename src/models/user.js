const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true,
	},
	email: {
		type: String,
		required: true,
		trim: true,
        unique: true,
		lowercase: true,
		validate(value) {
			if (!validator.isEmail(value)) throw new Error('Email is invalid');
		},
	},
	password: {
		type: String,
		required: true,
		trim: true,
		minlength: 7,
		validate(value) {
			if (value.toLowerCase().includes('password'))
				throw new Error('password cannot contain "password"');
		},
	},
	age: {
		type: Number,
		default: 0,
		validate(value) {
			if (value < 0) {
				throw new Error('Age must be a positive Number');
			}
		},
	},
	tokens: [{
		token: {
			type: String,
			required: true
		}
	}]
});

userSchema.virtual('tasks',{
	ref: 'Task',
	localField: '_id',
	foreignField: 'owner'
})



// whenever JSON.stringiyfy is called for a instance this below function we run
userSchema.methods.toJSON = function () {
	const userObject = this.toObject()
	delete userObject.password
	delete userObject.tokens
	return userObject
}


// methods are available to instances
userSchema.methods.generateToken = async function ()  {
	const token = jwt.sign({_id: this._id.toString()}, 'secretkey', {expiresIn: '7 days'})
	this.tokens = this.tokens.concat({token})
	await this.save()
	return token
}


// static methods are available on models
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)
    
    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return user
}

// setting up the middleware before saving
userSchema.pre('save', async function (next) {
	if (this.isModified('password')) {
		// new user or changing existing password
		this.password = await bcrypt.hash(this.password, 8);
	}
	next(); //this tells we are done with the functionalities we wanted to added before saving
});

// / the 'Task' parameter we have passed
// mongoose takes it in lowercase and pluralises it for Collection name in db
const User = mongoose.model('User', userSchema);

module.exports = User;
