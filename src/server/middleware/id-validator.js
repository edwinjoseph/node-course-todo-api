const { ObjectID } = require('mongodb');

module.exports = (req, res, next) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(404).send({ error: { message: 'Todo not found.' }})
    }
    next();
};
