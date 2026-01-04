const jwt = require('jsonwebtoken');

function validateAuthToken(tokenValue) {
    try {
        const decodedPayload = jwt.verify(tokenValue, 'secret');
        return decodedPayload;
    } catch (err) {
        throw new Error('Token verification failed');
    }
}

module.exports = validateAuthToken;
