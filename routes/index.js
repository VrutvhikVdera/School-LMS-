const express = require('express');

const adminRouter = require('./admin');
const studentRouter = require('./student');
const teacherRouter = require('./teacher');

const {changePassword,forgotPassword,resetPassword} = require('../controllers/auth/authController');

const authenticateRequest = require('../middlewares/authmiddleware');

const mainRouter = express.Router();

/*COMMON AUTH ROUTES*/

// change password (login required)
mainRouter.put(
    '/user/change-password',
    authenticateRequest,
    changePassword
);

// forgot password (no login)
mainRouter.post(
    '/user/forgot-password',
    forgotPassword
);

// reset password (no login)
mainRouter.put(
    '/user/reset-password',
    resetPassword
);

/*ROLE BASED ROUTES */

mainRouter.use('/admin', adminRouter);
mainRouter.use('/student', studentRouter);
mainRouter.use('/teacher', teacherRouter);

module.exports = mainRouter;
