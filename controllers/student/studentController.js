// const bcrypt = require('bcrypt');
const bcrypt = require('bcryptjs');

const User = require('../../models/user/userModel');
const Standard = require('../../models/standard/standardModel');

/* =========================
   STUDENT MANAGEMENT
========================= */

async function registerStudent(req, res) {
  try {
    const { mentorTeacher, standardRef, password } = req.body;

    // validate teacher
    const teacher = await User.findById(mentorTeacher);
    if (!teacher || teacher.userRole !== 'teacher') {
      return res.status(400).json({
        message: 'Invalid teacher selected'
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
      standardRef
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

    const updatedStudent = await User.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({
        message: 'Student not found'
      });
    }

    return res.status(200).json({
      message: 'Student updated successfully',
      data: updatedStudent
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Student update failed',
      error: err.message
    });
  }
}

async function removeStudent(req, res) {
  try {
    const { id } = req.params;

    const student = await User.findById(id);
    if (!student) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (student.userRole !== 'student') {
      return res.status(403).json({
        message: 'Account is not a student'
      });
    }

    await User.findByIdAndDelete(id);

    return res.status(200).json({
      message: 'Student deleted successfully',
      deletedId: id
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Student deletion failed',
      error: err.message
    });
  }
}

module.exports = {
  registerStudent,
  updateStudent,
  removeStudent
};
