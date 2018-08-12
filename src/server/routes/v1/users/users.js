const pick = require('lodash/pick');

const User = require('../../../models/user');

const createUser = (req, res) => {
    const body = pick(req.body, ['email', 'password']);
    const user = new User(body);

    user.save()
        .then(() => user.generateAuthToken())
        .then(token => {
            res.header('x-auth', token).send(user);
        })
        .catch(err => {
            res.status(400).send(err);
        });
};

const getUser = (req, res) => {
    res.send(req.user);
};

const logIn = (req, res) => {
    const body = pick(req.body, ['email', 'password']);
    User.findByCredentials(body.email, body.password)
        .then(user => {
            user.generateAuthToken()
                .then(token => {
                    res.header('x-auth', token).send(user);
                })
        })
        .catch(err => {
            res.status(400).send(err);
        })
};

const logOut = (req, res) => {
    req.user.removeToken(req.token)
        .then(() => {
            res.status(200).send();
        })
        .catch(() => {
            res.status(400).send();
        });
};

module.exports = {
    createUser,
    getUser,
    logIn,
    logOut,
};
