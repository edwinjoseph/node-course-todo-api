'use strict';
require('./system/init');

const express = require('express');
const app = express();

require('./express/configure-middleware')(app);
require('./routes/v1/todos')(app);
require('./routes/v1/users')(app);

module.exports = app;
