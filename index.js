// const serverFramework = require('express');
// const cookieReader = require('cookie-parser');
// const formParser = require('body-parser');
// const initializeDB = require('./config/database');
// const apiEndpoints = require('./routes/api');

// const app = serverFramework();
// const PORT = 3000;

// // database connect
// initializeDB();

// // middlewares
// app.use(serverFramework.json());
// app.use(formParser.urlencoded({ extended: true }));
// app.use(cookieReader());

// // routes
// app.use('/api', apiEndpoints);

// // server start
// app.listen(PORT, (error) => {
//     if (error) {
//         console.log('Unable to start server');
//         return;
//     }
//     console.log(`Server running at http://localhost:${PORT}`);
// });



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
