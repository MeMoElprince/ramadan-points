const dotenv = require('dotenv');
const app = require('./app');
const mongoose = require('mongoose');

dotenv.config({ path: './config.env' });

// Connect to the database
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

console.log({DB});
console.log('trying to connect to the database....');
mongoose.connect(DB).then(con => console.log('DB connection successful!')).catch(err => console.log('DB connection failed!', err.message));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
