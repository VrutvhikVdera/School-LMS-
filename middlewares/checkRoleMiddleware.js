function authorizeRoles(allowedRoles) {
    return function (req, res, next) {
        const currentUserRole = req.user.userRole || req.user.role;

        if (!allowedRoles.includes(currentUserRole)) {
            return res.status(403).json({
                status: 403,
                message: 'Permission denied'
            });
        }

        next();
    };
}

module.exports = authorizeRoles;
