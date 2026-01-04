const mongoose = require('mongoose');

const standardSchema = new mongoose.Schema(
    {
        stdName: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        description: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Standard', standardSchema);
