const User = require('../models/user');
const createError = require('../handlers/api-error');

module.exports = (req, res, next) => {
    const token = req.header('x-auth');

    User.findByToken(token)
        .then(user => {
            if (!user) {
                return Promise.reject(createError('user', 'ERRNOUSER'));
            }
            req.user = user;
            req.token = token;
            next();
        })
        .catch(err => {
            res.status(401).send(err);
        });
};
