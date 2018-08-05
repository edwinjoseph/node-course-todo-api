const { ObjectID } = require('mongodb');

module.exports = (req, res, next) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send({ error: { message: 'Invalid ID used.' }})
    }
    next();
};