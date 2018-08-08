const { createUser, getUser } = require('./users.js');
const authenticate = require('../../../middleware/authenticate');

module.exports = app => {
    app.post('/api/v1/users',
        createUser
    );
    app.get('/api/v1/users/me',
        authenticate,
        getUser
    );
};
