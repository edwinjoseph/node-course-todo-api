const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');
const Todo = require('../../../src/server/models/todo');
const User = require('../../../src/server/models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [
    {
        _id: userOneId,
        email: "edwin1@mailinator.com",
        password: "password1",
        tokens: [
            {
                access: 'auth',
                token: jwt.sign({ _id: userOneId, auth: 'access' }, 'oaKdl9Elgj').toString()
            }
        ]
    },
    {
        _id: userTwoId,
        email: "edwin2@mailinator.com",
        password: "password2",
        tokens: [
            {
                access: 'auth',
                token: jwt.sign({ _id: userTwoId, auth: 'access' }, 'oaKdl9Elgj').toString()
            }
        ]
    }
];
const todos = [
    {
        _id: new ObjectID(),
        text: "First test todo"
    },
    {
        _id: new ObjectID(),
        text: "Second test todo"
    }
];

const populateTodos = done => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
};

const populateUsers = done => {
    User.remove({}).then(() => {
        const saveUsers = users.concat().map(user => new User(user).save());
        return Promise.all(saveUsers);
    }).then(() => done());
};

module.exports = {
    todos,
    users,
    populateTodos,
    populateUsers,
};