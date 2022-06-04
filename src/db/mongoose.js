const mongoose = require('mongoose');


// connection to db
mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
	useNewUrlParser: true,
});




