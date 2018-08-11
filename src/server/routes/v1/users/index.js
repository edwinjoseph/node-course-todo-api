const { createUser, getUser } = require('./users.js');
const authenticate = require('../../../middleware/authenticate');

module.exports = app => {
    app.post('/v1/users',
        createUser
    );
    app.get('/v1/users/me',
        authenticate,
        getUser
    );
    app.post('/v1/users/login',
        createUser
    );
};
