
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