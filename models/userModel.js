const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    confirmPassword: {
        type: String,
        required: [true, 'Confirm Password is required']
    },
    role: {
        type: String,
        enum: ['user'],
        default: 'user'
    },
    active: {
        type: Boolean,
        default: true,
        select: false
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    },
    season: [
        {
            year: {
                type: Number,
                required: [true, 'Year is required']
            },
            points: {
                type: Number,
                required: [true, 'Points is required'],
                default: 0
            }
        }
    ],
    

});



const User = mongoose.model('User', userSchema);




module.exports = User;