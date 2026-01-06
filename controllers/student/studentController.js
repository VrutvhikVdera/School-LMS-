const bcrypt = require('bcryptjs');

const User = require('../../models/user/userModel');
const Standard = require('../../models/standard/standardModel');
const Attendance = require('../../models/attendance/attendanceModel');

/*STUDENT MANAGEMENT */

async function registerStudent(req, res) {
    try {
        const { mentorTeacher, standardRef, password } = req.body;

        // validate teacher
        const teacher = await User.findOne({
            _id: mentorTeacher,
            userRole: 'teacher',
            isActive: true
        });

        if (!teacher) {
            return res.status(400).json({
                message: 'Invalid or inactive teacher selected'
            });
        }

        // validate standard
        const standard = await Standard.findById(standardRef);
        if (!standard) {
            return res.status(400).json({
                message: 'Invalid standard selected'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const student = await User.create({
            ...req.body,
            hashedPassword,
            userRole: 'student',
            mentorTeacher,
            standardRef,
            isActive: true
        });

        return res.status(201).json({
            message: 'Student registered successfully',
            data: student
        });
    } catch (err) {
        return res.status(500).json({
            message: 'Student registration failed',
            error: err.message
        });
    }
}

async function updateStudent(req, res) {
    try {
        const { id } = req.params;

        const student = await User.findOne({
            _id: id,
            userRole: 'student',
            isActive: true
        });

        if (!student) {
            return res.status(404).json({
                message: 'Active student not found'
            });
        }

        Object.assign(student, req.body);
        await student.save();

        return res.status(200).json({
            message: 'Student updated successfully',
            data: student
        });
    } catch (err) {
        return res.status(500).json({
            message: 'Student update failed',
            error: err.message
        });
    }
}

/*SOFT DELETE STUDEN */

async function removeStudent(req, res) {
    try {
        const { id } = req.params;

        const student = await User.findOne({
            _id: id,
            userRole: 'student',
            isActive: true
        });

        if (!student) {
            return res.status(404).json({
                message: 'Active student not found'
            });
        }

        student.isActive = false;
        await student.save();

        return res.status(200).json({
            message: 'Student deactivated successfully (soft delete)',
            studentId: id
        });
    } catch (err) {
        return res.status(500).json({
            message: 'Student deletion failed',
            error: err.message
        });
    }
}

/*STUDENT VIEW ATTENDANCE */

async function getMyAttendance(req, res) {
    try {
        const studentId = req.user.userId;
        const { from, to } = req.query;

        const filter = {
            student: studentId,
            isActive: true
        };

        if (from && to) {
            filter.date = {
                $gte: new Date(from),
                $lte: new Date(to)
            };
        }

        const attendance = await Attendance.find(filter)
            .sort({ date: -1 })
            .populate('markedBy', 'fullName')
            .populate('standardRef', 'stdName');

        return res.status(200).json({
            message: 'Attendance fetched successfully',
            data: attendance
        });
    } catch (err) {
        return res.status(500).json({
            message: 'Failed to fetch attendance',
            error: err.message
        });
    }
}

module.exports = {
    registerStudent,
    updateStudent,
    removeStudent,
    getMyAttendance
};
