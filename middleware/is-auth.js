const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    if(!req.get('Authorization')) {
        const error = new Error('Not authenticated.');
        error.statusCode = 401;
        throw err;
    }
    const token = req.get('Authorization').split(' ')[1];
    let decodedToken;
    
    try{
        decodedToken  = jwt.verify(token, '$ghy#izpe;%VT*ewdjo');
    } catch(err) {
        err.statusCode = 500;
        throw err;
    }

    if(!decodedToken) {
        const authenticationError = new Error('Not authenticated.');
        authenticationError.statusCode = 401;
        throw authenticationError;
    }
    req.userId = decodedToken.userId;
    next();
}