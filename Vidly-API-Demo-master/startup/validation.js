const Joi = require('joi'); //adding joiobjectid here allows us to use it globally

module.exports = function () {
    Joi.objectId = require('joi-objectid')(Joi);
}