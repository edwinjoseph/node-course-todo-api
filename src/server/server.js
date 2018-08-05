require('./system/init');

const PORT = process.env.PORT || 3000;

const express = require('express');
const app = express();

require('./express/configure-middleware')(app);
require('./routes/api/v1/todos')(app);

app.listen(PORT, () => {
    console.log(`Started on port ${PORT}.`);
});

module.exports = app;