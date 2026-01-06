const bcrypt = require('bcryptjs');

const User = require('../../models/user/userModel');
const Standard = require('../../models/standard/standardModel');
const Subject = require('../../models/subject/subjectModel');
const Attendance = require('../../models/attendance/attendanceModel');

/*SUBJECTS */

async function getSubjects(req, res) {
    try {
        const subjects = await Subject.find()
            .populate('standardRef', 'stdName')
            .populate('mentorTeacher', 'fullName emailAddress');

        return res.status(200).json({
            status: 200,
            message: 'Subjects fetched successfully',
            data: subjects
        });
    } catch (err) {
        return res.status(500).json({
            status: 500,
            message: 'Failed to fetch subjects',
            error: err.message
        });
    }
}

/*GET ALL STUDENTS*/

async function getAllStudents(req, res) {
    try {
        const students = await User.find({
            userRole: 'student',
            isActive: true
        })
            .select('-hashedPassword')
            .populate('standardRef', 'stdName')
            .populate('mentorTeacher', 'fullName emailAddress');

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

/*GET ALL TEACHERS */

async function getAllTeachers(req, res) {
    try {
        const teachers = await User.find({
            userRole: 'teacher',
            isActive: true
        })
            .select('-hashedPassword')
            .populate('subjectAssignments', 'subjectName');

        return res.status(200).json({
            message: 'Teachers fetched successfully',
            data: teachers
        });
    } catch (err) {
        return res.status(500).json({
            message: 'Failed to fetch teachers',
            error: err.message
        });
    }
}

/*TEACHER MANAGEMENT */

async function registerTeacher(req, res) {
    try {
        const { subjectAssignments, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const teacher = new User({
            ...req.body,
            hashedPassword,
            userRole: 'teacher',
            subjectAssignments: subjectAssignments || [],
            isActive: true
        });

        await teacher.save();

        if (subjectAssignments?.length) {
            await Subject.updateMany(
                { _id: { $in: subjectAssignments } },
                { $set: { mentorTeacher: teacher._id } }
            );
        }

        return res.status(201).json({
            message: 'Teacher registered successfully',
            data: teacher
        });
    } catch (err) {
        return res.status(500).json({
            message: 'Teacher registration failed',
            error: err.message
        });
    }
}

async function updateTeacher(req, res) {
    try {
        const { id } = req.params;
        const { subjectAssignments, ...updates } = req.body;

        const teacher = await User.findOne({ _id: id, isActive: true });
        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }

        Object.assign(teacher, updates);

        if (subjectAssignments) {
            await Subject.updateMany(
                { mentorTeacher: id },
                { $set: { mentorTeacher: null } }
            );

            await Subject.updateMany(
                { _id: { $in: subjectAssignments } },
                { $set: { mentorTeacher: id } }
            );

            teacher.subjectAssignments = subjectAssignments;
        }

        await teacher.save();

        return res.status(200).json({
            message: 'Teacher updated successfully',
            data: teacher
        });
    } catch (err) {
        return res.status(500).json({
            message: 'Teacher update failed',
            error: err.message
        });
    }
}

/*DELETE TEACHER*/

async function removeTeacher(req, res) {
    try {
        const { id } = req.params;

        const teacher = await User.findOne({
            _id: id,
            userRole: 'teacher',
            isActive: true
        });

        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }

        const linkedStudents = await User.countDocuments({
            mentorTeacher: id,
            userRole: 'student',
            isActive: true
        });

        if (linkedStudents > 0) {
            return res.status(409).json({
                message: 'Teacher cannot be deleted while students are assigned'
            });
        }

        await Subject.updateMany(
            { mentorTeacher: id },
            { $set: { mentorTeacher: null } }
        );

        teacher.isActive = false;
        await teacher.save();

        return res.status(200).json({
            message: 'Teacher deactivated successfully (soft delete)'
        });
    } catch (err) {
        return res.status(500).json({
            message: 'Teacher deletion failed',
            error: err.message
        });
    }
}

/*STANDARD MANAGEMENT*/

async function createStandard(req, res) {
    try {
        const standard = new Standard(req.body);
        await standard.save();

        return res.status(201).json({
            message: 'Standard created successfully',
            data: standard
        });
    } catch (err) {
        return res.status(500).json({
            message: 'Standard creation failed',
            error: err.message
        });
    }
}

async function getAllStandards(req, res) {
    try {
        const standards = await Standard.find();

        return res.status(200).json({
            message: 'Standards fetched successfully',
            data: standards
        });
    } catch (err) {
        return res.status(500).json({
            message: 'Failed to fetch standards',
            error: err.message
        });
    }
}

async function updateStandard(req, res) {
    try {
        const standard = await Standard.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!standard) {
            return res.status(404).json({ message: 'Standard not found' });
        }

        return res.json({
            message: 'Standard updated successfully',
            data: standard
        });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
}

async function deleteStandard(req, res) {
    try {
        const { id } = req.params;

        const standard = await Standard.findById(id);
        if (!standard) {
            return res.status(404).json({ message: 'Standard not found' });
        }

        await Subject.deleteMany({ standardRef: id });
        await Standard.findByIdAndDelete(id);

        return res.status(200).json({
            message: 'Standard and related subjects deleted'
        });
    } catch (err) {
        return res.status(500).json({
            message: 'Standard deletion failed',
            error: err.message
        });
    }
}

/*SUBJECT MANAGEMENT*/

async function createSubject(req, res) {
    try {
        const subject = new Subject(req.body);
        await subject.save();

        return res.status(201).json({
            message: 'Subject created successfully',
            data: subject
        });
    } catch (err) {
        return res.status(500).json({
            message: 'Subject creation failed',
            error: err.message
        });
    }
}

async function getAllSubjects(req, res) {
    try {
        const subjects = await Subject.find()
            .populate('standardRef', 'stdName')
            .populate('mentorTeacher', 'fullName');

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

async function updateSubject(req, res) {
    try {
        const subject = await Subject.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!subject) {
            return res.status(404).json({ message: 'Subject not found' });
        }

        return res.json({
            message: 'Subject updated successfully',
            data: subject
        });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
}

async function deleteSubject(req, res) {
    try {
        const subject = await Subject.findByIdAndDelete(req.params.id);

        if (!subject) {
            return res.status(404).json({ message: 'Subject not found' });
        }

        return res.json({
            message: 'Subject deleted successfully'
        });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
}

/*ADMIN VIEW ATTENDANCE*/

async function getAttendanceReport(req, res) {
    try {
        const { studentId, standardId, from, to } = req.query;

        const filter = { isActive: true };

        if (studentId) filter.student = studentId;
        if (standardId) filter.standardRef = standardId;

        if (from && to) {
            filter.date = {
                $gte: new Date(from),
                $lte: new Date(to)
            };
        }

        const attendance = await Attendance.find(filter)
            .sort({ date: -1 })
            .populate('student', 'fullName emailAddress')
            .populate('markedBy', 'fullName')
            .populate('standardRef', 'stdName');

        return res.status(200).json({
            message: 'Attendance report fetched successfully',
            data: attendance
        });
    } catch (err) {
        return res.status(500).json({
            message: 'Failed to fetch attendance report',
            error: err.message
        });
    }
}

module.exports = {
    getSubjects,
    getAllStudents,
    getAllTeachers,
    getAllStandards,
    getAllSubjects,
    registerTeacher,
    updateTeacher,
    removeTeacher,
    createStandard,
    updateStandard,
    deleteStandard,
    createSubject,
    updateSubject,
    deleteSubject,
    getAttendanceReport
};
