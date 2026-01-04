// const express = require('express');

// const { registerUser, loginUser } = require('../../controllers/auth/authController');
// const adminController = require('../../controllers/admin/adminController');
// const studentController = require('../../controllers/student/studentController');

// const authenticateRequest = require('../../middlewares/authmiddleware');
// const authorizeRoles = require('../../middlewares/checkRoleMiddleware');

// const teacherRouter = express.Router();

// // base route
// teacherRouter.get('/', (req, res) => {
//     res.json({ message: 'Teacher API is active' });
// });

// // auth
// teacherRouter.post('/register', registerUser);
// teacherRouter.post('/login', loginUser);

// // teacher creation (admin only)
// teacherRouter.post(
//     '/create',
//     authenticateRequest,
//     authorizeRoles(['admin']),
//     adminController.TeacherRegister
// );

// // student creation by teacher or admin
// teacherRouter.post(
//     '/students',
//     authenticateRequest,
//     authorizeRoles(['admin', 'teacher']),
//     studentController.StudentRegister
// );

// module.exports = teacherRouter;



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

// teacher creating students (optional but useful)
teacherRouter.post(
    '/students',
    authenticateRequest,
    authorizeRoles(['teacher']),
    studentController.registerStudent
);

module.exports = teacherRouter;
