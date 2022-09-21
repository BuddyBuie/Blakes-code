const mongoose = require('mongoose');
const Joi = require('joi');

const Customer = mongoose.model('Customer', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
    },
    isGold: {
        type: Boolean,
        default: false
    },
    phone: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
    },
}));


function validateCustomer(customer) {
    const schemajoi = Joi.object({
        name: Joi.string().min(5).max(50).required(), //must be a string with min of 3 characters and is required
        phone: Joi.string().min(5).max(50).required(), //must be a string with min of 3 characters and is required
        isGold: Joi.boolean()
    });
    return schemajoi.validate(customer); //this body object comes from a client, namely, a json object

}

exports.Customer = Customer;
exports.validate = validateCustomer;