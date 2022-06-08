const express = require('express');
const Task = require('../models/task');
const authMiddleware = require('../middleware/auth');

const router = new express.Router();

router.post('/tasks', authMiddleware, async (req, res) => {
	// const task = new Task(req.body);
	const task = new Task({
		description: req.body.description,
		completed: req.body.completed,
		owner: req.user._id,
	});

	try {
		await task.save();
		res.status(201).send(task);
	} catch (e) {
		res.status(400).send(e);
	}
});
// tasks?completed=false
// tasks?limit=5&skip=2
// tasks?sortBy=createdAt:desc
router.get('/tasks', authMiddleware, async (req, res) => {
	const search = {}
	const sort = {}

	if(req.query.sortBy){
		const parts  = req.query.sortBy.split(':')
		sort[parts[0]] = parts[1] === 'asec' ? 1 : -1   // 1 for ascending and -1 for descend
	}

	if(req.query.completed){
		req.query.completed = req.query.completed === 'true'
		search.completed = req.query.completed
	}
	search.owner = req.user._id

	try {
		const tasks = await Task.find(search).limit(req.query.limit).skip(req.query.skip).sort(sort); 
		if (tasks) res.send(tasks);
		else res.status(404).send();
	} catch (e) {
		res.status(500).send(e);
	}
});

router.get('/tasks/:id', authMiddleware, async (req, res) => {
	const _id = req.params.id;

	try {
		const task = await Task.findOne({ _id, owner: req.user._id });

		if (task) res.send(task);
		else res.status(404).send();
	} catch (e) {
		res.status(500).send();
	}
});

router.patch('/tasks/:id', authMiddleware, async (req, res) => {
	const _id = req.params.id;
	const task = req.body;
	const allowedUpdates = ['description', 'completed'];

	const updates = Object.keys(task);

	const isValid = updates.every((update) => {
		return allowedUpdates.includes(update);
	});

	if (!isValid) return res.status(400).send({ error: 'invalid updates' });

	try {
		const getTask = await Task.findOne({ _id, owner: req.user._id }); // checks for a task and right owner

		if (!getTask) res.status(404).send();

		updates.forEach((update) => {
			getTask[update] = task[update];
		});

		getTask.save();

		// const updatedTask = await Task.findByIdAndUpdate(_id, task, {
		// 	new: true,
		// 	runValidators: true,
		// });

		res.send(getTask);
	} catch (e) {
		res.status(400).send(e);
	}
});

router.delete('/tasks/:id', authMiddleware, async (req, res) => {
	const _id = req.params.id;
	try {
		
		const task = await Task.findOneAndDelete({_id, owner: req.user._id})
		if (task) res.send(task);
		else res.status(404).send({ error: 'cannot find task' });
	} catch (e) {
		res.status(500).send(e);
	}
});

module.exports = router;
