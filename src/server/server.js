const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('./db/mongoose');
const Todo = require('./models/todo');

const app = express();
app.use(bodyParser.json());

require('./routes/api/v1/todos')(app);

app.listen(3000, () => {
    console.log('Started on port 3000.');
});