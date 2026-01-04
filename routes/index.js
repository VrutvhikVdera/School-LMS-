const express = require('express');

const adminRouter = require('./admin');
const studentRouter = require('./student');
const teacherRouter = require('./teacher');

const mainRouter = express.Router();

// role based routes
mainRouter.use('/admin', adminRouter);
mainRouter.use('/student', studentRouter);
mainRouter.use('/teacher', teacherRouter);

module.exports = mainRouter;
