const { getTodos, createTodo, getTodo, deleteTodo, updateTodo } = require('./todos.js');
const idValidator = require('../../../../middleware/id-validator');

module.exports = app => {
    app.get('/api/v1/todos',
        getTodos
    );
    app.post('/api/v1/todos',
        createTodo
    );
    app.get('/api/v1/todos/:id',
        idValidator,
        getTodo
    );
    app.delete('/api/v1/todos/:id',
        idValidator,
        deleteTodo
    );
    app.patch('/api/v1/todos/:id',
        idValidator,
        updateTodo
    );
};