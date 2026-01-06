const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const connectDatabase = require('./config/db.connect');
const mainRoutes = require('./routes/index');

const app = express();
const PORT = 3000;

// connect database
connectDatabase();

// middlewares
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// routes
app.use('/api', mainRoutes);

// server start
app.listen(PORT, (error) => {
    if (error) {
        console.error('Server failed to start');
        return;
    }
    console.log(`Server running on http://localhost:${PORT}`);
});
