const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();
const { Rental } = require('../models/rental');


router.post('/', auth, async (req, res) => {//find all genres

    if (!req.body.customerId) return res.status(400).send('customer ID not provided');
    if (!req.body.movieId) return res.status(400).send('customer ID not provided');

    const rental = await Rental.findOne({
        'customer._id': req.body.customerId,
        'movie._id': req.body.movieId,
    });
    if (!rental) return res.status(404).send('rental does not exist');

    if (rental.dateReturned) return res.status(400).send('return is already processed');

    // rental.dateReturned = new Date();
    // await rental.save();

    return res.status(200).send();//else



});

module.exports = router;
