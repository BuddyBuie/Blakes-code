const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth'); //authorization means making sure user has proper permissions
const config = require('config');
const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const router = express.Router();
const mongoose = require('mongoose');
const { User, validate } = require('../models/user');


//get methods
//preventing someone from just typing in your id and getting to your info
router.get('/me', auth, async (req, res) => {
    //safer than just passing id through route and getting from req. while excluding the password property
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);
});


//creating new users
router.post('/', async (req, res) => {//find all users
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //make sure user isnt already registered
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send('User already registered.');

    //if valid new user, save to database
    //here we are using lodash pick method to only get the name email and password fields so a malicious user cannot send unwanted data

    user = new User(_.pick(req.body, ['name', 'email', 'password']));
    const salt = await bcrypt.genSalt(10); //10 is number of rounds to generate salt, higher number = more complex
    user.password = await bcrypt.hash(user.password, salt); //getting our hashed password where password is user.password and is salted

    await user.save();

    //generate token
    const token = user.generateAuthToken();
    //when a client wants to logout, client side, the client will delete the token from the client
    //here we are using lodash pick method to only return the name and email to the client, not the password
    //headers should be prefixed with x-
    //here we are putting the token in the header of our response so that we can have persistent sessions, no need to verify/login again
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email'])); //return the user to the client
});

module.exports = router;
