const pick = require('lodash/pick');
const isBoolean = require('lodash/isBoolean');

const Todo = require('../../../models/todo');
const idValidator = require('../../../middleware/id-validator');

const createTodo = (req, res) => {
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
};
const getTodos = (req, res) => {
    Todo.find()
        .then(todos => {
            res.send({
                todos
            });
        })
        .catch(err => {
            res.status(400).send(err);
        })
};
const getTodoById = (req, res) => {
    Todo.findById(req.params.id)
        .then(todo => {
            if (!todo) {
                return res.status(404).send({ error: { message: 'Todo not found.' }})
            }
            res.send({todo});
        })
        .catch(err => {
            res.status(500).send(err);
        });
};
const deleteTodoById = (req, res) => {
    Todo.findByIdAndRemove(req.params.id)
        .then(todo => {
            if (!todo) {
                return res.status(404).send({ error: { message: 'Todo not found.' }})
            }
            res.send({ todo });
        })
        .catch(err => {
            res.status(500).send(err);
        });
};
const updateTodoById = (req, res) => {
    const body = pick(req.body, ['text', 'completed']);

    if (isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(req.params.id, { $set: body }, { new: true })
        .then(todo => {
            if (!todo) {
                return res.status(404).send({ error: { message: 'Todo not found.' }})
            }
            res.send({ todo });
        })
        .catch(err => {
            res.status(500).send(err);
        });
};

module.exports = app => {
    app.post('/api/v1/todos',
        createTodo
    );
    app.get('/api/v1/todos',
        getTodos
    );
    app.get('/api/v1/todos/:id',
        idValidator,
        getTodoById
    );
    app.delete('/api/v1/todos/:id',
        idValidator,
        deleteTodoById
    );
    app.patch('/api/v1/todos/:id',
        idValidator,
        updateTodoById
    );
};