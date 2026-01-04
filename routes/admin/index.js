// const express = require('express');

// const { registerUser, loginUser } = require('../../controllers/auth/authController');
// const adminController = require('../../controllers/admin/adminController');
// const studentController = require('../../controllers/student/studentController');

// const authenticateRequest = require('../../middlewares/authmiddleware');
// const authorizeRoles = require('../../middlewares/checkRoleMiddleware');

// const adminRouter = express.Router();

// // base route
// adminRouter.get('/', (req, res) => {
//     res.json({ message: 'Admin API is active' });
// });

// // auth
// adminRouter.post('/register', registerUser);
// adminRouter.post('/login', loginUser);

// // subjects
// adminRouter.get(
//     '/subjects',
//     authenticateRequest,
//     authorizeRoles(['admin']),
//     adminController.getSubjects
// );

// // teacher management
// adminRouter.post(
//     '/teachers',
//     authenticateRequest,
//     authorizeRoles(['admin']),
//     adminController.registerTeacher
// );

// adminRouter.put(
//     '/teachers/:id',
//     authenticateRequest,
//     authorizeRoles(['admin']),
//     adminController.updateTeacher
// );

// adminRouter.delete(
//     '/teachers/:id',
//     authenticateRequest,
//     authorizeRoles(['admin']),
//     adminController.removeTeacher
// );

// // student management
// adminRouter.post(
//     '/students',
//     authenticateRequest,
//     authorizeRoles(['admin']),
//     studentController.StudentRegister
// );

// adminRouter.put(
//     '/students/:id',
//     authenticateRequest,
//     authorizeRoles(['admin']),
//     studentController.editStudent
// );

// adminRouter.delete(
//     '/students/:id',
//     authenticateRequest,
//     authorizeRoles(['admin']),
//     studentController.deleteStudent
// );

// // standards
// adminRouter.post(
//     '/standards',
//     authenticateRequest,
//     authorizeRoles(['admin']),
//     adminController.addStandard
// );

// adminRouter.put(
//     '/standards/:id',
//     authenticateRequest,
//     authorizeRoles(['admin']),
//     adminController.editStandard
// );

// adminRouter.delete(
//     '/standards/:id',
//     authenticateRequest,
//     authorizeRoles(['admin']),
//     adminController.deleteStandard
// );

// // subjects management
// adminRouter.post(
//     '/subjects',
//     authenticateRequest,
//     authorizeRoles(['admin']),
//     adminController.addSubject
// );

// adminRouter.put(
//     '/subjects/:id',
//     authenticateRequest,
//     authorizeRoles(['admin']),
//     adminController.editSubject
// );

// adminRouter.delete(
//     '/subjects/:id',
//     authenticateRequest,
//     authorizeRoles(['admin']),
//     adminController.deleteSubject
// );

// module.exports = adminRouter;





const express = require('express');

const { registerUser, loginUser } = require('../../controllers/auth/authController');
const adminController = require('../../controllers/admin/adminController');
const studentController = require('../../controllers/student/studentController');

const authenticateRequest = require('../../middlewares/authmiddleware'); // ✅ FIX: filename
const authorizeRoles = require('../../middlewares/checkRoleMiddleware');

const adminRouter = express.Router();

// base route
adminRouter.get('/', (req, res) => {
    res.json({ message: 'Admin API is active' });
});

// auth
adminRouter.post('/register', registerUser);
adminRouter.post('/login', loginUser);

// get subjects
adminRouter.get(
    '/subjects',
    authenticateRequest,
    authorizeRoles(['admin']),
    adminController.getSubjects
);

// teacher management
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

// student management  ✅ FIXED function names
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

// standard management ✅ FIXED function names
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

// subject management ✅ FIXED function names
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

module.exports = adminRouter;
