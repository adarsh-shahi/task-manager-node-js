const mongoose = require('mongoose');


// connection to db
mongoose.connect(process.env.MONGODB_URL, {
	useNewUrlParser: true,
});

 


