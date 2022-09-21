const { Rental } = require('../../models/rental');
const request = require('supertest');
const { User } = require('../../models/user');
const mongoose = require('mongoose');

describe('/api/returns', () => {
    let server;
    let customerId;
    let rental;
    let token;

    const exec = () => {
        return request(server)
            .post('/api/returns')
            .set('x-auth-token', token)
            .send({ customerId, movieId });

    }

    beforeEach(async () => {
        //open server
        server = require('../../index');
        token = new User().generateAuthToken();
        customerId = mongoose.Types.ObjectId();
        movieId = mongoose.Types.ObjectId();
        rental = new Rental({
            customer: {
                _id: customerId,
                name: '12345',
                phone: '12345'
            },
            movie: {
                _id: movieId,
                title: 'movie title',
                dailyRentalRate: 2
            }

        });
        await rental.save();
    });
    afterEach(async () => {
        //close server
        await server.close();
        await Rental.remove({}); // removes all genres from databse that we created

    });

    it('should return 401 if client is not logged in', async () => {
        token = ''; //reset token

        const res = await exec();

        expect(res.status).toBe(401);
    });

    it('should return 400 if client id is not provided', async () => {
        customerId = '';

        const res = await exec();

        expect(res.status).toBe(400);
    });
    it('should return 400 if movie id is not provided', async () => {
        movieId = '';

        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return 404 if no rental is found given customer/movie', async () => {

        await Rental.remove({});

        const res = await exec();

        expect(res.status).toBe(404);
    });

    it('should return 400 if rental was already processed', async () => {

        rental.dateReturned = new Date();
        await rental.save();
        //simply giving the rental a date and saving it ensures it has a return date

        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return 200 if request is valid', async () => {


        const res = await exec();

        expect(res.status).toBe(200);
    });




});