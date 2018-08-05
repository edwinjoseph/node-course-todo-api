const { ObjectID } = require('mongodb');
const Todo = require('../../../models/todo');

module.exports = app => {
    app.post('/api/v1/todos', (req, res) => {
        const todo = new Todo({
            text: req.body.text
        });
        todo.save()
            .then(doc => {
                res.send(doc);
            })
            .catch(err => {
                res.status(400).send(err)
            })
    });
    app.get('/api/v1/todos', (req, res) => {
        Todo.find()
            .then(todos => {
                res.send({
                    todos
                });
            })
            .catch(err => {
                res.status(400).send(err);
            })
    });
    app.get('/api/v1/todos/:id', (req, res) => {
        const id = req.params.id;
        if (!ObjectID.isValid(id)) {
            return res.status(400).send({ error: { message: 'Invalid ID used.' }})
        }

        Todo.findById(id)
            .then(todo => {
                if (!todo) {
                    return res.status(404).send({ error: { message: 'Todo not found.' }})
                }
                res.send({ todo });
            })
            .catch(err => {
                res.status(500).send(err);
            })
    });
};