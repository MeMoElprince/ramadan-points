
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError.js');


exports.getMe = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+active');
    if(!user) return next(new AppError('User not found', 404));
    if(!user.active) return next(new AppError('Your account has not been verified yet!', 401));
    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    });
});


exports.getTopUsers = catchAsync(async (req, res, next) => {
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 10;
    const skip = (page - 1) * limit;
    const users = await User.find().sort('-points').limit(limit).skip(skip);
    res.status(200).json({
        status: 'success',
        data: {
            users
        }
    });
});