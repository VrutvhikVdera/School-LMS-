const validateAuthToken = require('../utils/verifyToken');

function authenticateRequest(req, res, next) {
    try {
        const authorizationHeader = req.headers.authorization;

        if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                status: 401,
                message: 'Authorization token missing'
            });
        }

        const token = authorizationHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                status: 401,
                message: 'Authorization token missing'
            });
        }

        const decodedUser = validateAuthToken(token);
        req.user = decodedUser;

        next();
    } catch (err) {
        return res.status(401).json({
            status: 401,
            message: 'Unauthorized access'
        });
    }
}

module.exports = authenticateRequest;
