const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const ObjectID = mongodb.ObjectId;
 
const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';

MongoClient.connect(
	connectionURL,
	{ useNewUrlParser: true },
	(error, client) => {
		if (error) console.log('unable to connect ' + error);
		else {
			const db = client.db(databaseName);
			//   db.collection("users").insertOne(
			//     {
			//       name: "adarsh",
			//       age: 20,
			//     },
			//     (error, result) => {
			//       if (error) console.log("unable to insert");
			//       else console.log(result); // array of documents in this case only one
			//     }
			//   );
			//   db.collection("users").insertMany(
			//     [
			//       {
			//         name: "ashish",
			//         age: 15,
			//       },
			//       {
			//         name: "harsh",
			//         age: 17,
			//       },
			//       {
			//         name: "bford",
			//         age: 23,
			//       },
			//     ],
			//     (error, result) => {
			//         if(error) console.log(error);
			//         else console.log(result);
			//     }
			//   );

			// db.collection('users').findOne( {name: 'adarsh'} , (error, user) => {  // search by name
			//   if(error) console.log(error);
			//   else console.log(user);
			// })

			// // search by id
			// db.collection('users').findOne( {_id: new ObjectID("629a18391c8f4d49e7d6cd28")} , (error, user) => {
			//   if(error) console.log(error);
			//   else console.log(user);
			// })

			// find returns a cursor
			// db.collection('users').find({name: 'adarsh'}).toArray( (error, users)  => {
			//   if(error) console.log(error);
			//   else console.log(users);
			// } )

			// // returns count no. of results
			// db.collection('users').find({name: 'adarsh'}).count( (error, count)  => {
			//   if(error) console.log(error);
			//   else console.log(count);
			// } )

			// db.collection('tasks').findOne(
			// 	{ _id: new ObjectID('629a241210133115f884caa9') },
			// 	(error, result) => {
			// 		if (error) console.log(error);
			// 		else console.log(result);
			// 	}
			// );

			// db.collection('tasks')
			// 	.find({ completed: false })
			// 	.toArray((error, result) => {
			// 		if (error) console.log(error);
			// 		else console.log(result);
			// 	});

			// Callback Way
			// db.collection('users').updateOne({_id: new ObjectID("")}, (error, resolved) => {

			// })

			// UPDATE - ONE
			// promise way
			// db.collection('users').updateOne({_id: new ObjectID("629a18391c8f4d49e7d6cd27")}, {
			//   $inc: {
			//     age: 1
			//   }
			//  })
			// .then( (resolve) => {
			//     console.log('updated successfully ' + resolve);
			// })
			// .catch((reject) => {
			//   console.log(reject);
			// })

			// UPDATE - MANY
			// db.collection('users').updateMany({name: 'adarsh'}, {
			//   $set: {
			//     name: 'adarsh shahi'
			//   }
			// })
			// .then((resolve) => {
			//   console.log(resolve);
			// })
			// .catch((error) => {
			//   console.log(reject);
			// })

			// DELETE - ONE
			db.collection('users')
				.deleteOne({ name: 'adarsh shahi' })
				.then((relsove) => {
					console.log(relsove);
				})
				.catch((reject) => {
					console.log(reject);
				});
		}
	}
);
