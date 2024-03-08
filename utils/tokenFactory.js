const jwt = require('jsonwebtoken');

module.exports.sign = (load) => {
    return jwt.sign(load, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

module.exports.verify = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
}