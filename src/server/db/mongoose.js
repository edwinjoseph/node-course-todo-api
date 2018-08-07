const mongoose = require('mongoose');

if (process.env.NODE_ENV === 'test') {
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoTest';
}

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });

module.exports = mongoose;
module.exports.close = done => mongoose.connection.close(done);
