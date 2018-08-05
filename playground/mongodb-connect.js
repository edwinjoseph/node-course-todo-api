const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true })
    .then(client => {
        console.log('Connected to MongoDB server');
        const db = client.db('TodoApp');

        // db.collection('Todos').insertOne({ text: 'Something to do.', completed: false})
        //     .then(res => {
        //         console.log(JSON.stringify(res.ops, null, 2))
        //     })
        //     .catch(err => {
        //         console.log('Unable to insert todo.', err);
        //     });

        // db.collection('Users').insertOne({ firstname: 'Kezia', lastname: 'Joseph', age: 28, location: 'London' })
        //     .then(res => {
        //         console.log(res.ops[0]._id.getTimestamp())
        //     })
        //     .catch(err => {
        //         console.log('Unable to insert user.', err);
        //     });

        client.close();
    })
    .catch(() => {
        console.log('Unable to connect to MongoDB server');
    });
