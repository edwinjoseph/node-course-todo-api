const pick = require('lodash/pick');

const User = require('../../../models/user');

const createUser = (req, res) => {
    const body = pick(req.body, ['email', 'password']);
    const user = new User(body);

    user.save()
        .then(() => {
            return user.generateAuthToken();
        })
        .then(token => {
            res.header('x-auth', token).send(user);
        })
        .catch(err => {
            res.status(400).send(err);
        });
};

module.exports = {
    createUser,
};
