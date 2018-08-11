const { getTodos, createTodo, getTodo, deleteTodo, updateTodo } = require('./todos.js');
const idValidator = require('../../../middleware/id-validator');

module.exports = app => {
    app.get('/v1/todos',
        getTodos
    );
    app.post('/v1/todos',
        createTodo
    );
    app.get('/v1/todos/:id',
        idValidator,
        getTodo
    );
    app.delete('/v1/todos/:id',
        idValidator,
        deleteTodo
    );
    app.patch('/v1/todos/:id',
        idValidator,
        updateTodo
    );
};