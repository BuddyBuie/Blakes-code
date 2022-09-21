const { Customer, validate } = require('../models/customer');
//this is object destructuring
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/', async (req, res) => {//find all customers
    const customers = await Customer.find().sort('name');

    res.send(customers);
});

//get customer by id
router.get('/:id', async (req, res) => {
    const customer = await Customer.findById(req.params.id);

    if (!customer) return res.status(404).send('The Customer with given ID was not found'); //404 object not found, if we didnt match the ids from earlier, a Customer wont exist
    res.send(customer); //else send the customer
});

//adding new customer
router.post('/', async (req, res) => { // updating the customer object
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let customer = new Customer({
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold
    });
    customer = await customer.save(); //saves to database which returns a promise result of actual document in database
    res.send(customer); //return the customer to the client
});

//handling http delete requests
router.delete('/:id', async (req, res) => {
    const customer = await Customer.findByIdAndRemove(req.params.id);

    if (!customer) return res.status(404).send('The customer with given ID was not found'); //404 object not found, if we didnt match the ids from earlier, a customer wont exist
    res.send(customer); //if deleted successfully, return deleted customer to client

});

//Updating a customer
router.put('/:id', async (req, res) => {

    //look up customer
    //if doesnt exist, return 404
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone,
    },
        {
            new: true //new to true gives us updated object from database
        });

    if (!customer) return res.status(404).send('customer not found ..');
    res.send(customer); //if not null, return to client
});

module.exports = router;
