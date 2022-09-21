const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();
const mongoose = require('mongoose');
const { Genre, validate } = require('../models/genre');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');

router.get('/', async (req, res) => {//find all genres
    // throw new Error('could not get genre');
    const genres = await Genre.find().sort('name');
    res.send(genres);
});



//adding new genre
//auth is passed as a middleware function to be executed before the next function in post, which is a route handler
router.post('/', auth, async (req, res) => { // updating the genre object
    //we need to make sure only authorized users can add new genres
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let genre = new Genre({ name: req.body.name });
    genre = await genre.save(); //saves to database which returns a promise result of actual document in database

    res.send(genre); //return the genre to the client
});


router.get('/:id', validateObjectId, async (req, res) => {

    const genre = await Genre.findById(req.params.id);

    if (!genre) return res.status(404).send('The genre with given ID was not found'); //404 object not found, if we didnt match the ids from earlier, a genre wont exist
    res.send(genre); //else send the genre
});

//Updating a genre
router.put('/:id', async (req, res) => {

    //look up genre
    //if doesnt exist, return 404
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, { //second param is our update object
        new: true //new to true gives us updated object from database
    });

    if (!genre) return res.status(404).send('Genre not found ..');

    res.send(genre); //if not null, return to client
});

//handling http delete requests
//passing two middleware functions here and they are executed in sequeance, auth->admin->our async delete function
router.delete('/:id', [auth, admin], async (req, res) => {
    const genre = await Genre.findByIdAndRemove(req.params.id);

    if (!genre) return res.status(404).send('The genre with given ID was not found'); //404 object not found, if we didnt match the ids from earlier, a genre wont exist


    res.send(genre); //if deleted successfully, return deleted genre to client

});



module.exports = router;