const { createUser } = require('./users.js');

module.exports = app => {
    app.post('/api/v1/users',
        createUser
    );
};
