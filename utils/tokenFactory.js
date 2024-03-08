const jwt = require('jsonwebtoken');

module.exports.sign = (load, secret = process.env.JWT_SECRET, expires = process.env.JWT_EXPIRES_IN) => {
    return jwt.sign(load, secret, {
        expiresIn: expires
    });
}

module.exports.verify = (token, secret = process.env.JWT_SECRET) => {
    return jwt.verify(token, secret);
}