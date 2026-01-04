const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true
    },

    firstName: {
      type: String,
      required: true
    },

    lastName: {
      type: String
    },

    emailAddress: {
      type: String,
      required: true,
      unique: true
    },

    phoneNumber: {
      type: String
    },

    hashedPassword: {
      type: String,
      required: true
    },

    userRole: {
      type: String,
      enum: ['admin', 'student', 'teacher'],
      required: true
    },

    standard: {
      type: String
    },

    enrolledCourses: [
      {
        type: String
      }
    ],

    preferredLanguage: {
      type: String,
      default: 'English'
    },

    notificationsEnabled: {
      type: Boolean,
      default: true
    },

    attendanceHistory: [
      {
        date: {
          type: Date
        },
        status: {
          type: String,
          enum: ['present', 'absent', 'leave']
        }
      }
    ],

    profileImage: {
      type: String
    },

    lastLoginAt: {
      type: Date
    },

    updatedBy: {
      type: String
    },

    createdAt: {
      type: Date,
      default: Date.now
    },

    updatedAt: {
      type: Date,
      default: Date.now
    },

    authToken: {
      type: String
    },

    subjectAssignments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject'
      }
    ],

    mentorTeacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },

    standardRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Standard'
    }
  }
);

// auto update updatedAt on save
accountSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('User', accountSchema);
