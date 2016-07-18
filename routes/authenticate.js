var auth = {};

auth.authenticate = function(request, response, next) {
    if (request.session.user) {
        next();
    } else {
        response.statusCode = 403;
        response.json({ result: 'failure', 'message': 'User is not logged in' });
    }
};

auth.authenticateAdmin = function(request, response, next) {
    if (request.session.user !== undefined && request.session.user.admin === 'true') {
        next();
    } else {
        response.statusCode = 403;
        response.json({ result: 'failure', 'message': 'User is not an admin' });
    }
};

module.exports = auth;
