const { ObjectID } = require('mongodb');
const createError = require('../handlers/api-error');

module.exports = (req, res, next) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(404).send(createError('base', 'ERRNOTODO'))
    }
    next();
};
