'use strict';
require('./system/init');

const express = require('express');
const app = express();

require('./express/configure-middleware')(app);
require('./routes/api/todos')(app);
require('./routes/api/users')(app);

module.exports = app;
