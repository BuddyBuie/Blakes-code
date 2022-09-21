const { User } = require('../../../models/user');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');
describe('user.generateAuthToken', () => {
    it('should return valid JSON web token', () => {
        const payload = { _id: new mongoose.Types.ObjectId(), isAdmin: true }
        const user = new User(payload);
        const token = user.generateAuthToken();
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        expect(decoded).toMatchObject(payload);
    });
});