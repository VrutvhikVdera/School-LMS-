const express = require('express');

const teacherController = require('../../controllers/teacher/teacherController');
const studentController = require('../../controllers/student/studentController');

const authenticateRequest = require('../../middlewares/authmiddleware');
const authorizeRoles = require('../../middlewares/checkRoleMiddleware');

const teacherRouter = express.Router();

// base route
teacherRouter.get('/', (req, res) => {
    res.json({ message: 'Teacher API is active' });
});

// teacher profile
teacherRouter.get(
    '/me',
    authenticateRequest,
    authorizeRoles(['teacher']),
    teacherController.getTeacherProfile
);

// teacher students
teacherRouter.get(
    '/students',
    authenticateRequest,
    authorizeRoles(['teacher']),
    teacherController.getMyStudents
);

// teacher subjects
teacherRouter.get(
    '/subjects',
    authenticateRequest,
    authorizeRoles(['teacher']),
    teacherController.getMySubjects
);

// update own profile
teacherRouter.put(
    '/me',
    authenticateRequest,
    authorizeRoles(['teacher']),
    teacherController.updateTeacherProfile
);

// teacher creating students
teacherRouter.post(
    '/students',
    authenticateRequest,
    authorizeRoles(['teacher']),
    studentController.registerStudent
);

module.exports = teacherRouter;
