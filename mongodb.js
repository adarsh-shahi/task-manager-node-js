const mongodb = require("mongodb");

const MongoClient = mongodb.MongoClient;

const connectionURL = "mongodb://127.0.0.1:27017";
const databaseName = "task-manager";

MongoClient.connect(
  connectionURL,
  { useNewUrlParser: true },
  (error, client) => {
    if (error) console.log("unable to connect " + error);
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

        db.collection('tasks').insertMany([{
            description: 'give aptitude test',
            completed: true
        },
        {
            description: 'give aptitude test',
            completed: true
        },
        {
            description: 'give aptitude test',
            completed: true
        }
    ], (error, result) => {
            if(error) console.log(error);
            else console.log(result);
        })

    }
  }
);
