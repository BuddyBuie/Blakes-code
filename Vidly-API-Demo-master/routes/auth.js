
const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const router = express.Router();
const mongoose = require('mongoose');
const Joi = require('joi');
const { User } = require('../models/user');



//validating users
router.post('/', async (req, res) => {//find all users
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //validating user name or email
    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Invalid email or password');
    //bcrypt compare is used to compare a plaintext password with a hashed password including the salt we gave it, returns a boolean
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Invalid email or passwordpw');

    //get token
    const token = user.generateAuthToken();
    //else the login is valid and we send true to the client
    res.send(token);
});

//for validating a request to login
function validate(req) {
    const schemajoi = Joi.object({
        email: Joi.string().min(5).max(50).required().email(), //must be a string with min of 3 characters and is required
        password: Joi.string().min(5).max(255).required() //must be a string with min of 3 characters and is required
    });
    return schemajoi.validate(req); //this body object comes from a client, namely, a json object

}
module.exports = router;
