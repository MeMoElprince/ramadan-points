const mongoose = require('mongoose');
const validator = require('validator');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    img: {
        type: String,
        default: function (){
            const names = ['تمر هندي','عرق سوس','صوبيا','سمبوسه', 'رز بلبن', 'كاسترد', 'قطايف', 'جلاش', 'بسبوسه', 'كنافه'];
            const num = Math.floor((Math.random() * 1000000000000)) % 10;
            return names[num];
        },
        enum: ['تمر هندي','عرق سوس','صوبيا','سمبوسه', 'رز بلبن', 'كاسترد', 'قطايف', 'جلاش', 'بسبوسه', 'كنافه']
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
    points: {
        type: Number,
        default: 0
    },
    list: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Schedule'
        }
    ],
    passwordChangedAt: Date,
    token: String,
    passwordResetToken: String,
    passwordResetExpires: Date
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

userSchema.methods.createPasswordResetToken = function() {
    // creat a reset token consist of 6 random numbers
    const resetToken = crypto.randomBytes(3).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    return resetToken;
}

const User = mongoose.model('User', userSchema);
module.exports = User;