const User = require('../../models/user/userModel');
const Subject = require('../../models/subject/subjectModel');
const Attendance = require('../../models/attendance/attendanceModel');

/*TEACHER DASHBOARD */

async function getTeacherProfile(req, res) {
    try {
        const teacherId = req.user.userId;

        const teacher = await User.findById(teacherId)
            .select('-hashedPassword')
            .populate('subjectAssignments', 'subjectName')
            .populate('standardRef', 'stdName');

        if (!teacher || teacher.userRole !== 'teacher') {
            return res.status(404).json({
                message: 'Teacher not found'
            });
        }

        return res.status(200).json({
            message: 'Teacher profile fetched successfully',
            data: teacher
        });
    } catch (err) {
        return res.status(500).json({
            message: 'Failed to fetch teacher profile',
            error: err.message
        });
    }
}

/*STUDENTS UNDER TEACHER */

async function getMyStudents(req, res) {
    try {
        const teacherId = req.user.userId;

        const students = await User.find({
            mentorTeacher: teacherId,
            userRole: 'student',
            isActive: true
        })
            .select('-hashedPassword')
            .populate('standardRef', 'stdName');

        return res.status(200).json({
            message: 'Students fetched successfully',
            data: students
        });
    } catch (err) {
        return res.status(500).json({
            message: 'Failed to fetch students',
            error: err.message
        });
    }
}

/*SUBJECTS HANDLED BY TEACHER*/

async function getMySubjects(req, res) {
    try {
        const teacherId = req.user.userId;

        const subjects = await Subject.find({
            mentorTeacher: teacherId
        }).populate('standardRef', 'stdName');

        return res.status(200).json({
            message: 'Subjects fetched successfully',
            data: subjects
        });
    } catch (err) {
        return res.status(500).json({
            message: 'Failed to fetch subjects',
            error: err.message
        });
    }
}

/*UPDATE OWN PROFILE */

async function updateTeacherProfile(req, res) {
    try {
        const teacherId = req.user.userId;

        const updatedTeacher = await User.findByIdAndUpdate(
            teacherId,
            req.body,
            { new: true, runValidators: true }
        ).select('-hashedPassword');

        if (!updatedTeacher) {
            return res.status(404).json({
                message: 'Teacher not found'
            });
        }

        return res.status(200).json({
            message: 'Profile updated successfully',
            data: updatedTeacher
        });
    } catch (err) {
        return res.status(500).json({
            message: 'Profile update failed',
            error: err.message
        });
    }
}

/*MARK ATTENDANCE TEACHER */

async function markAttendance(req, res) {
    try {
        const teacherId = req.user.userId;
        const { date, standardRef, records } = req.body;

        if (!date || !standardRef || !records?.length) {
            return res.status(400).json({
                message: 'Date, standard and attendance records are required'
            });
        }

        // verify students to teacher
        const studentIds = records.map(r => r.studentId);

        const validStudents = await User.find({
            _id: { $in: studentIds },
            mentorTeacher: teacherId,
            userRole: 'student',
            isActive: true
        });

        if (validStudents.length !== studentIds.length) {
            return res.status(403).json({
                message: 'One or more students are invalid or not assigned to this teacher'
            });
        }

        const attendanceDocs = records.map(r => ({
            student: r.studentId,
            standardRef,
            date,
            status: r.status,
            markedBy: teacherId
        }));

        await Attendance.insertMany(attendanceDocs, { ordered: false });

        return res.status(201).json({
            message: 'Attendance marked successfully'
        });
    } catch (err) {
        
        if (err.code === 11000) {
            return res.status(409).json({
                message: 'Attendance already marked for one or more students'
            });
        }

        return res.status(500).json({
            message: 'Failed to mark attendance',
            error: err.message
        });
    }
}

/*EXPORTS */

module.exports = {
    getTeacherProfile,
    getMyStudents,
    getMySubjects,
    updateTeacherProfile,
    markAttendance
};
