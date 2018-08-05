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
                console.log(err);
                res.status(400).send(err)
            })
    });
};