const dotenv = require('dotenv');
const app = require('./app');
const mongoose = require('mongoose');



process.on('uncaughtException', err => {
    console.log('UNHANDLED REJECTION');
    console.log(err.name, err.message);
    process.exit(1);
});


dotenv.config({ path: './config.env' });

// get the database uri from the environment variable
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

// Connect to the database
console.log('trying to connect to the database....');
mongoose.connect(DB).then(con => console.log('DB connection successful!')).catch(err => console.log('DB connection failed!', err.message));

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});