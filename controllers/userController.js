
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError.js');
const Schedule = require('../models/scheduleModel');

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
    const data = {
        count: users.length,
        users
    }
    if(req.user)
        data.currentUser = req.user;
    res.status(200).json({
        status: 'success',
        data
    });
});

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if(allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
}

exports.updateMe = catchAsync(async (req, res, next) => {
    if(req.body.password || req.body.passwordConfirm) return next(new AppError('This route is not for password updates. Please use /changePassword', 400));
    const filteredBody = filterObj(req.body, 'name', 'phoneNumber');
    const user = await User.findByIdAndUpdate(req.user.id, {
        ...filteredBody
    }, 
    {
        new: true,
        runValidators: true
    });
    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    });
});


exports.changePassword = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');
    if(!(await user.correctPassword(req.body.currentPassword, user.password))) return next(new AppError('Your current password is wrong!', 401));
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();
    res.status(200).json({
        status: 'success',
        message: 'Password changed successfully'
    });
});


exports.getAnalytics = catchAsync(async (req, res, next) => {
    const date = new Date().getTime() / 1000;
    const {user} = req;
    // getting the schedules that are in the past and the user has not completed
    let unCompletedScedules = await Schedule.aggregate([
        {
            $addFields: {
                scheduleLastDate: { $add: ["$date", "$long"] }
            }
        },
        {
            $match: {
                scheduleLastDate:  { $lt: date }
            }
        },
        {
            $match: {
                _id: { $nin: user.list }
            }
        }
    ]);
    unCompletedScedules = unCompletedScedules.length;
    const completedSchedules = user.list.length;
    res.status(200).json({
        status: 'success',
        data: {
            unCompletedScedules,
            completedSchedules
        }
    });

});