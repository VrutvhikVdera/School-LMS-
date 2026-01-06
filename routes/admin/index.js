const express = require('express');

const adminController = require('../../controllers/admin/adminController');
const studentController = require('../../controllers/student/studentController');
const { registerUser, loginUser } = require('../../controllers/auth/authController');

const authenticateRequest = require('../../middlewares/authmiddleware');
const authorizeRoles = require('../../middlewares/checkRoleMiddleware');

const adminRouter = express.Router();

/*Base */

adminRouter.get('/', (req, res) => {
    res.json({ message: 'Admin API is active' });
});

/*Auth */

adminRouter.post('/register', registerUser);
adminRouter.post('/login', loginUser);

/*ADMIN LIST APIs*/

// get all students
adminRouter.get(
    '/students',
    authenticateRequest,
    authorizeRoles(['admin']),
    adminController.getAllStudents
);

// get all teachers
adminRouter.get(
    '/teachers',
    authenticateRequest,
    authorizeRoles(['admin']),
    adminController.getAllTeachers
);

// get all standards
adminRouter.get(
    '/standards',
    authenticateRequest,
    authorizeRoles(['admin']),
    adminController.getAllStandards
);

// get all subjects
adminRouter.get(
    '/subjects',
    authenticateRequest,
    authorizeRoles(['admin']),
    adminController.getAllSubjects
);

/*TEACHER MANAGEMENT */

adminRouter.post(
    '/teachers',
    authenticateRequest,
    authorizeRoles(['admin']),
    adminController.registerTeacher
);

adminRouter.put(
    '/teachers/:id',
    authenticateRequest,
    authorizeRoles(['admin']),
    adminController.updateTeacher
);

adminRouter.delete(
    '/teachers/:id',
    authenticateRequest,
    authorizeRoles(['admin']),
    adminController.removeTeacher
);

/*STUDENT MANAGEMENT */

adminRouter.post(
    '/students',
    authenticateRequest,
    authorizeRoles(['admin']),
    studentController.registerStudent
);

adminRouter.put(
    '/students/:id',
    authenticateRequest,
    authorizeRoles(['admin']),
    studentController.updateStudent
);

adminRouter.delete(
    '/students/:id',
    authenticateRequest,
    authorizeRoles(['admin']),
    studentController.removeStudent
);

/*STANDARD MANAGEMENT*/

adminRouter.post(
    '/standards',
    authenticateRequest,
    authorizeRoles(['admin']),
    adminController.createStandard
);

adminRouter.put(
    '/standards/:id',
    authenticateRequest,
    authorizeRoles(['admin']),
    adminController.updateStandard
);

adminRouter.delete(
    '/standards/:id',
    authenticateRequest,
    authorizeRoles(['admin']),
    adminController.deleteStandard
);

/*SUBJECT MANAGEMENT */

adminRouter.post(
    '/subjects',
    authenticateRequest,
    authorizeRoles(['admin']),
    adminController.createSubject
);

adminRouter.put(
    '/subjects/:id',
    authenticateRequest,
    authorizeRoles(['admin']),
    adminController.updateSubject
);

adminRouter.delete(
    '/subjects/:id',
    authenticateRequest,
    authorizeRoles(['admin']),
    adminController.deleteSubject
);

/*ADMIN VIEW ATTENDANCE */

adminRouter.get(
    '/attendance',
    authenticateRequest,
    authorizeRoles(['admin']),
    adminController.getAttendanceReport
);

module.exports = adminRouter;
