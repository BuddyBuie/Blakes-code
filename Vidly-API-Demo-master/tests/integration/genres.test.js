const { mongo, default: mongoose } = require('mongoose');
const request = require('supertest'); //supertest allows us to send requests to an endpoint
const { Genre } = require('../../models/genre');
const { User } = require('../../models/user');
let server;

describe('/api/genres', () => {


    //beforeeach allows us to call a function before each test inside of our first describe block
    beforeEach(() => {
        //open server
        server = require('../../index');
    });
    afterEach(async () => {
        //close server
        await server.close();
        await Genre.remove({}); // removes all genres from databse that we created

    });

    describe('GET /', () => {
        it('should return all genres', async () => {
            await Genre.collection.insertMany([
                { name: 'genre1' },
                { name: 'genre2' },
            ]); //insertmany allows us to insert multiple documents with 1 command, useful for testing if DB populates properly
            const res = await request(server).get('/api/genres');
            expect(res.status).toBe(200); //checking that the connection is OK
            expect(res.body.length).toBe(2); //checking that we get two genre objects in body of response
            expect(res.body.some(g => g.name === 'genre1')).toBeTruthy();
            expect(res.body.some(g => g.name === 'genre2')).toBeTruthy();


        });
    });

    describe('GET /:id', () => {


        it('should return a genre if valid id is passed', async () => {
            const genre = new Genre({ name: 'genre1' });
            await genre.save();

            const res = await request(server).get('/api/genres/' + genre._id);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', genre.name);
        });

        it('should return a 404 if invalid id is passed', async () => {

            const res = await request(server).get('/api/genres/1');

            expect(res.status).toBe(404);
        });
    });

    describe('POST /', () => {

        //define happy path, in each test, change 1 param that aligns with name of path
        //happy path is a template we use for all tests

        let token;
        let name;

        const exec = async () => {
            return await request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({ name: name });

        }

        beforeEach(() => { //before each test is ran, these are set, however in each test we can change the values to fit our tests
            token = new User().generateAuthToken();
            name = 'genre1';
        });

        it('should return 401 if client is not logged in', async () => {
            token = '';

            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should return 400 if genre is less than 5 chars', async () => {
            name = '1234';

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 if genre is more than 50 chars', async () => {

            name = new Array(52).join('a');

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should save genre if it is valid', async () => {

            await exec();
            const genre = await Genre.find({ name: 'genre1' });

            expect(genre).not.toBeNull();
        });

        it('should return genre from body of response if valid', async () => {

            const res = await exec();

            const genre = await Genre.find({ name: 'genre1' });

            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', 'genre1');
        });



    });


});