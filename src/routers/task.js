const express = require('express')
const Task = require('../models/task');

const router = new express.Router()

router.post('/tasks', async (req, res) => {
	const task = new Task(req.body);

	try {
		await task.save();
		res.status(201).send(task);
	} catch (e) {
		res.status(400).send(e);
	}
});





router.get('/tasks', async (req, res) => {
	try {
		const tasks = await Task.find({});
		res.send(tasks);
	} catch (e) {
		res.status(500).send(e);
	}
});

router.get('/tasks/:id', async (req, res) => {
	const _id = req.params.id;

	try {
		const task = await Task.findById(_id);
		if (task) res.send(task);
		else res.status(404).send();
	} catch (e) {
		res.status(500).send();
	}
});



router.patch('/tasks/:id', async (req, res) => {
	const _id = req.params.id;
	const task = req.body;
	const allowedUpdates = ['description', 'completed'];

	const updates = Object.keys(task);

	const isValid = updates.every((update) => {
		return allowedUpdates.includes(update);
	});

	if (!isValid) return res.status(400).send({ error: 'invalid updates' });

	try {
		const updatedTask = await Task.findByIdAndUpdate(_id, task, {
			new: true,
			runValidators: true,
		});
		if (updatedTask) res.send(updatedTask);
		else res.status(400).send();
	} catch (e) {
		res.status(400).send(e);
	}
});



router.delete('/tasks/:id', async (req, res) => {
	const _id = req.params.id
	try{
		const task = await Task.findByIdAndDelete(_id)
		if(task) res.send(task)
		else res.status(404).send({error: 'cannot find task'})
	}
	catch(e){
		res.status(500).send(e)
	}
})

module.exports = router