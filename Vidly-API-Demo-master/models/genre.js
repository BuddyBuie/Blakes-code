const mongoose = require('mongoose');
const Joi = require('joi');


const genreSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    }
});

const Genre = mongoose.model('Genre', genreSchema);



function validateGenre(genre) {
    const schemajoi = Joi.object({
        name: Joi.string().min(5).max(50).required() //must be a string with min of 3 characters and is required
    });
    return schemajoi.validate(genre); //this body object comes from a client, namely, a json object

}
exports.genreSchema = genreSchema;
exports.Genre = Genre;
exports.validate = validateGenre;