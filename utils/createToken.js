const jwt = require('jsonwebtoken');

function generateAuthToken(userData) {
    const payload = {
        userId: userData._id,
        userRole: userData.userRole || userData.role
    };

    const token = jwt.sign(
        payload,
        'secret',
        { expiresIn: '1h' }
    );

    return token;
}

module.exports = generateAuthToken;
