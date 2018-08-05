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
};