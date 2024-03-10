
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError.js');
const Schedule = require('../models/scheduleModel');

exports.getMe = catchAsync(async (req, res, next) => {
    const {user} = req;
    const date = new Date().getTime() / 1000;
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
    const rank = await User.find().sort('-points').countDocuments({points: {$gt: user.points}});
    unCompletedScedules = unCompletedScedules.length;
    const completedSchedules = user.list.length;
    let sameUser = {};
    sameUser = {
        ...user._doc
    }
    sameUser.unCompletedScedules = unCompletedScedules;
    sameUser.completedSchedules = completedSchedules;
    sameUser.rank = rank + 1;
    const data = {
        user: sameUser
    }
    console.log({sameUser});
    console.log({completedSchedules, unCompletedScedules});
    res.status(200).json({
        status: 'success',
        data
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