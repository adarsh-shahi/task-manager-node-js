const express = require('express')
const User = require('../models/user');

const router = new express.Router()


router.post('/users', async (req, res) => {
	const user = new User(req.body);

	try {
		await user.save();
		res.status(201).send(user);
	} catch (e) {
		res.status(400).send(e);
	}
});

router.get('/users', async (req, res) => {
	try {
		const users = await User.find({});
		res.send(users);
	} catch (e) {
		res.status(500).send();
	}
});

router.get('/users/:id', async (req, res) => {
	const _id = req.params.id;

	try {
		const user = await User.findById(_id);
		if (user) res.send(user);
		else res.status(404).send();
	} catch (e) {
		res.status(500).send();
	}
});

router.patch('/users/:id', async (req, res) => {
	const _id = req.params.id;
	const user = req.body;

	const allowed = ['name', 'email', 'password', 'age'];
	const updates = Object.keys(user);

	const isValid = updates.every((update) => {
		return allowed.includes(update);
	});

	if (!isValid) return res.status(400).send({ error: 'invalid updates' });

	try {
		const updatedUser = await User.findByIdAndUpdate(_id, user, {
			new: true,
			runValidators: true,
		});
		if (updatedUser) res.send(updatedUser);
		else res.status(404).send(); // user is not found in db but operation was succesfull
	} catch (e) {
		res.status(400).send(e); // validation error
	}
});

router.delete('/users/:id', async (req, res) => {
	const _id = req.params.id
	try{
		const user = await User.findByIdAndDelete(_id)
		if(user) res.send(user)
		else res.status(404).send({error: 'cannot find user'})
	}
	catch(e){
		res.status(500).send(e)
	}
})



module.exports = router