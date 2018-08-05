const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/Todo', { useNewUrlParser: true });

module.exports = mongoose;