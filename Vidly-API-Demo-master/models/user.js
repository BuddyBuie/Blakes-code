const mongoose = require('mongoose');
const Joi = require('joi');
const config = require('config');
const jwt = require('jsonwebtoken');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024,
    },
    isAdmin: Boolean
});

//this builds a function to give to our user object called genauthtoken
//now our user object can use this function
//arrow functions do not use this, so we use function instead
//*RULE: METHODS PART OF OBJECTS DO NOT USE ARROW FUNCTIONS
userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey')); //first argument is the payload of our web token and second is our private key(secret) which will create our digital signature
    //webtoken for client session handling
    //_id: this._id is the object we will get from our auth() function in middleware/auth.js
    return token;
}

const User = mongoose.model('User', userSchema);



function validateUser(user) {
    const schemajoi = Joi.object({
        name: Joi.string().min(5).max(50).required(), //must be a string with min of 3 characters and is required
        email: Joi.string().min(5).max(50).required().email(), //must be a string with min of 3 characters and is required
        password: Joi.string().min(5).max(255).required() //must be a string with min of 3 characters and is required
    });
    return schemajoi.validate(user); //this body object comes from a client, namely, a json object

}
exports.userSchema = userSchema;
exports.User = User;
exports.validate = validateUser;