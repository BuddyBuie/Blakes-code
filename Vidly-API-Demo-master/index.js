const express = require('express');
const app = express();
const winston = require('winston');

require('./startup/logging')();
require('./startup/routes')(app); //here, our require is pointed to a function that we are passing our app object to
require('./startup/db')();
require('./startup/config')();
require('./startup/validation')();

const port = process.env.PORT || 3000; //the the PORT environment variable has been set, we will use that, otherwise use 3000
const server = app.listen(port, () => winston.info(`Listening on port ${port}..`)); // when listening on port 3000, the lambda function will be called
module.exports = server;