
module.exports = function (req, res, next) {
    //this function should be executed after auth middleware function which sets req.user
    //that means we have access to req.user since it was set previously
    //401 unauthorized
    //403 forbidden

    //if not an admin and trying to access
    if (!req.user.isAdmin) return res.status(403).send('Access denied');

    //else pass to next function
    next();
}