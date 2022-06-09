const express = require('express');
const User = require('../models/user');
const authMiddleware = require('../middleware/auth');
const multer = require('multer');
const sharp = require('sharp')

const router = new express.Router();

router.post('/users', async (req, res) => {
	const user = new User(req.body);

	try {
		await user.save();
		const token = await user.generateToken();
		res.status(201).send({ user, token });
	} catch (e) {
		res.status(400).send(e);
	}
});

router.post('/users/login', async (req, res) => {
	try {
		const user = await User.findByCredentials(
			req.body.email,
			req.body.password
		);
		const token = await user.generateToken();
		res.send({ user, token });
	} catch (e) {
		res.status(400).send();
	}
});

router.post('/users/logout', authMiddleware, async (req, res) => {
	try {
		req.user.tokens = req.user.tokens.filter((token) => {
			// removing current token
			return token.token !== req.token;
		});
		await req.user.save();
		res.send();
	} catch (e) {
		res.status(500).send();
	}
});

router.post('/users/logout/all', authMiddleware, async (req, res) => {
	try {
		req.user.tokens = [];
		await req.user.save();
		res.send();
	} catch (e) {
		res.status(500).send();
	}
});

router.get('/users/me', authMiddleware, async (req, res) => {
	res.send(req.user);
});

router.patch('/users/me', authMiddleware, async (req, res) => {
	const allowed = ['name', 'email', 'password', 'age'];
	const updates = Object.keys(req.body);

	const isValid = updates.every((update) => {
		return allowed.includes(update);
	});

	if (!isValid) return res.status(400).send({ error: 'invalid updates' });

	try {
		const getUser = req.user;

		updates.forEach((update) => {
			getUser[update] = req.body[update]; // while accessing a property dynamically we cant use '.'
		});

		await getUser.save(); // for using .save() so it can go through a middleware we have used above code

		/*
        This below code will update password but it won't be hashed because for converting
        simpleText password to hashedPassword we have set a 
        middlerware before 'saving' a user and this it just updating it so we wont go through a 
        middlware

        findByIdAndUpdate() - it bypasses mongoose, it performs direct operation on DB
                            thats why we even had to set runValidators to true but in schema we had
                            already defined it

		const updatedUser = await User.findByIdAndUpdate(_id, user, {
			new: true,
			runValidators: true,
		});

        */

		res.send(getUser);
	} catch (e) {
		res.status(400).send(e); // validation error
	}
});

router.delete('/users/me', authMiddleware, async (req, res) => {
	try {
		// const user = await User.findByIdAndDelete(req.user._id)
		// if(user) res.send(user)
		// else res.status(404).send({error: 'cannot find user'})
		await req.user.remove();
		res.send(req.user);
	} catch (e) {
		console.log('run this');
		res.status(500).send(e);
	}
});

const upload = multer({
	//	dest: 'avatars',     now multer will pass data to next function
	limits: {
		fileSize: 1000000,
	},
	fileFilter(req, file, callback) {
		if (!file.originalname.match(/\.(jpg|jpeg|png)/)) {
			return callback(new Error('File must ne JPG, JPEG, PNG'));
		}
		callback(undefined, true);
	},
});

router.post(
	'/users/me/avatar',
	authMiddleware,
	upload.single('avatar'),
	async (req, res) => {
		const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()
		req.user.avatar = buffer;
		await req.user.save();
		res.send();
	},
	(error, req, res, next) => {
		res.status(400).send({ error: error.message });
	}
);

router.delete('/users/me/avatar', authMiddleware, async (req, res) => {
	try {
		req.user.avatar = undefined;
		await req.user.save();
		res.send();
	} catch (e) {
		res.status(500).send();
	}
});

router.get('/users/:id/avatar', authMiddleware, async (req, res) => {
	try{
	 const user = await User.findById(req.params.id)

	 if(!user || !user.avatar)  throw new Error()
	 res.set('Content-Type', 'image/png')
	 res.send(user.avatar)
	}
	catch(e){
		res.status(404).send()  
	}
})

module.exports = router;
