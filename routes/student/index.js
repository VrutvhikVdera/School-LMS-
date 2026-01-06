const express = require('express');

const { registerUser, loginUser } = require('../../controllers/auth/authController');
const studentController = require('../../controllers/student/studentController');

const authenticateRequest = require('../../middlewares/authmiddleware');
const authorizeRoles = require('../../middlewares/checkRoleMiddleware');

const studentRouter = express.Router();

// base route
studentRouter.get('/', (req, res) => {
    res.json({ message: 'Student API is active' });
});

// auth
studentRouter.post('/register', registerUser);
studentRouter.post('/login', loginUser);

// create student (admin / teacher)
studentRouter.post(
    '/create',
    authenticateRequest,
    authorizeRoles(['admin', 'teacher']),
    studentController.registerStudent
);

studentRouter.put(
    '/:id',
    authenticateRequest,
    authorizeRoles(['admin', 'teacher']),
    studentController.updateStudent
);

studentRouter.delete(
    '/:id',
    authenticateRequest,
    authorizeRoles(['admin']),
    studentController.removeStudent
);

module.exports = studentRouter;
