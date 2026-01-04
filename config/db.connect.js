const mongoose = require('mongoose');

function connectDatabase() {
    mongoose
        .connect('mongodb://127.0.0.1:27017/school_lms')
        .then(() => {
            console.log('MongoDB connection successful');
        })
        .catch((error) => {
            console.error('MongoDB connection failed:', error);
        });
}

module.exports = connectDatabase;
