const mongoose = require('mongoose');
const validator = require('validator');

const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Confirm Password is required'],
        // This only works on CREATE and SAVE
        validate: {
            validator: function(el) {
                return el === this.password;
            },
            message: 'Passwords are not the same'
        },
        select: false
    },
    role: {
        type: String,
        enum: ['user'],
        default: 'user'
    },
    active: {
        type: Boolean,
        default: false,
        // select is set to false so that it doesn't show up in the output
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
    passwordChangedAt: Date,

});




userSchema.pre('save', function(next) {
    if(!this.isModified('password') || this.isNew) return next();
    this.passwordChangedAt = Date.now() - 1000;
    next();
});

userSchema.pre('save', function(next) {
    if(!this.isModified('password'))    return next();
    this.password = bcrypt.hashSync(this.password, 12);
    this.passwordConfirm = undefined;
    next();
});

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
}

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if(this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return JWTTimestamp < changedTimestamp;
    }
    return false;
}

const User = mongoose.model('User', userSchema);
module.exports = User;