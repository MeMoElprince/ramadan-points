const mongoose = require('mongoose');
const User = require('../models/userModel');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose.connect(DB).then(() => console.log('DB connection successful!')).catch(err => console.log(err));


const reset = async () => {
    const users = await User.find();
    for(let user of users){
        user.list = [];
        user.points = 0;
        await user.save({validateBeforeSave: false});
    }
    console.log('done');
    process.exit();
}

reset();