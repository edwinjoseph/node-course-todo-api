require('./system/init');

const express = require('express');
const app = express();

require('./express/configure-middleware')(app);
require('./routes/api/v1/todos')(app);

app.listen(3000, () => {
    console.log('Started on port 3000.');
});

module.exports = app;