const jwt = require('jsonwebtoken');
const config = require('config');

function auth(req, res, next) {
    //this method is for veryifying our json web token and return the payload
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).send('Access denied. No token provided');

    try {
        //if token is valid, will return the payload
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        req.user = decoded;
        next();//pass control to next middleware function
    } catch (ex) {
        res.status(400).send('Invalid token');
    }
}

module.exports = auth;