const Joi = require('joi');
const mongoose = require('mongoose');


const Rental = mongoose.model('Rental', new mongoose.Schema({
    customer: { //defining a new customer schema so we only use the properties we want for rentals, if we need more info just use a get request for customer api
        type: new mongoose.Schema({
            name: {
                type: String,
                required: true,
                minlength: 5,
                maxlength: 50
            },
            isGold: {
                type: Boolean,
                default: false
            },
            phone: {
                type: String,
                required: true,
                minlength: 5,
                maxlength: 50
            }
        }),
        required: true
    },
    movie: {//custom schema for what we need
        type: new mongoose.Schema({
            title: {
                type: String,
                required: true,
                trim: true,
                minlength: 5,
                maxlength: 255
            },
            dailyRentalRate: {
                type: Number,
                required: true,
                min: 0,
                max: 255
            }
        }),
        required: true
    },
    dateOut: {
        type: Date,
        required: true,
        default: Date.now
    },
    dateReturned: {
        type: Date
    },
    rentalFee: {
        type: Number,
        min: 0
    }
}));

function validateRental(rental) {
    const schemajoi = Joi.object({
        customerId: Joi.objectId().required(), //objectId was defined at top of page, used for validating ids in mongodb
        //if an invalid ID is given, mongo will return this message "customerId" with value "1234" fails to match the valid mongo id pattern
        movieId: Joi.objectId().required()
    });

    return schemajoi.validate(rental);
}

exports.Rental = Rental;
exports.validate = validateRental;