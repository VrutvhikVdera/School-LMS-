const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema(
    {
        subjectName: {
            type: String,
            required: true,
            trim: true
        },

        standardRef: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Standard',
            required: true
        },

        mentorTeacher: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Subject', subjectSchema);
