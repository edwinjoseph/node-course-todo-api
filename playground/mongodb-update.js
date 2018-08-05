const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true })
    .then(client => {
        console.log('Connected to MongoDB server');
        const db = client.db('TodoApp');

        db.collection('Users').findOneAndUpdate({
            _id: new ObjectID("5b66f588a9363b56d3b113fb")
        }, {
            $set: { firstname: 'Edwin' },
            $inc: { age: -4 }
        }, {
            returnOriginal: false
        })
            .then(res => {
                console.log(JSON.stringify(res, null, 2))
            })
            .catch(err => {
                console.log('Unable to delete todos.', err);
            });

        client.close();
    })
    .catch((err) => {
        return console.log('Unable to connect to MongoDB server', err);
    });
