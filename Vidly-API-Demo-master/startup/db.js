const winston = require('winston');
const mongoose = require('mongoose');
const config = require('config');

module.exports = function () { //for initializing our databse
    const db = config.get('db');
    mongoose.connect(db) //vidly is name of our database
        .then(() => winston.info(`Connected to ${db}..`)); //no need for .catch statement because winston will log the error for us
}