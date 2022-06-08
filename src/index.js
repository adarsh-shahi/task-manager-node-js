const express = require('express');
require('./db/mongoose');

const userRoutes = require('./routers/user')
const taskRoutes = require('./routers/task');


const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(userRoutes)
app.use(taskRoutes)


app.listen(port, () => {
	console.log('Server is up on port ' + port);
});

// const bcrypt = require('bcryptjs')

// const changing = async function(password){
// 	const hashedPassword = await bcrypt.hash(password, 8)
// 	console.log(hashedPassword);

// 	const isMatch = await bcrypt.compare('adarsh1009', hashedPassword)
// 	console.log(isMatch);

// }

// changing('adarsh1009')

// const jwt = require('jsonwebtoken')

// const myFunction = async function() {
// 		const token = jwt.sign({_id: 'adarsh435'}, 'secretkey', {expiresIn: '6 sec'})
// 		console.log(token);
// 		const data = jwt.verify(token, 'secretkey')
// 		console.log(data);
// }
// myFunction()

const User = require('./models/user')

const main = async () => {
    // const task = await Task.findById('5c2e505a3253e18a43e612e6')
    // await task.populate('owner').execPopulate()
    // console.log(task.owner)

    const user = await User.findById('629e811fd30ade1971d4f456')
	console.log(user); 
    await user.populate('tasks').execPopulate()
    console.log(user.tasks)
}

// main()
