const { ObjectID } = require('mongodb');
const mongoose = require('../src/server/db/mongoose');
const Todo = require('../src/server/models/todo');
const User = require('../src/server/models/user');

// const id = '5b674054ef25b1755df887211';
//
//
// if (!ObjectID.isValid(id)) {
//     return console.log('ID not valid');
// }
// Todo.find({ _id: id })
//     .then(todos => {
//         console.log('todos', todos);
//     });
//
// Todo.findOne({ _id: id })
//     .then(todo => {
//         console.log('todo', todo);
//     });

// Todo.findById(id)
//     .then(todo => {
//         if (!todo) {
//             return console.log('ID not found.')
//         }
//         console.log('todo', todo);
//     })
//     .catch(err => {
//         console.log(err);
//     });

const userId = '5b67207cdcb0f5638631124f';

User.findById(userId)
    .then(user => {
        if (!user) {
            return console.log('User does not exist.');
        }
        console.log('user', user);
    })
    .catch(err => {
        console.log(err)
    });
