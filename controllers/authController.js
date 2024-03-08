const User = require('../models/userModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const tokenFactory = require('../utils/tokenFactory');

exports.signup = catchAsync(async (req, res, next) => {
    // getting data
    const {name, email, password, passwordConfirm} = req.body;

    // creating user
    const newUser = await User.create({
        name,
        email,
        password,
        passwordConfirm
    });

    // hashing password will happen automatically in the pre save middleware in userModel
    // creating token
    const token = tokenFactory.sign({id: newUser._id});
    // sending response
    res.status(201).json({
        status: 'success',
        data: {
            user: newUser,
            token
        }
    });
});
    
exports.login = catchAsync(async (req, res, next) => {
    const {email, password} = req.body;
    // check if email and password exist
    if(!email || !password)
        return next(new AppError('Please provide email and password together', 400));
    // check if user exists and password is correct
    const user = await User.findOne({email}).select('+password');
    if(!user || !await user.correctPassword(password, user.password))
        return next(new AppError('Incorrect email or password', 401));
    // if everything is ok, send token to client
    const token = tokenFactory.sign({id: user._id});
    res.status(200).json({
        status: 'success',
        data: {
            token
        }
    });
});


exports.protect = catchAsync(async (req, res, next) => {
    // getting token and check if it exists
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
        token = req.headers.authorization.split(' ')[1];
    if(!token)
        return next(new AppError('You are not logged in! Please log in to get access.', 401));
    // verification token
    const decoded = await tokenFactory.verify(token);
    // check if user still exists
    const currentUser = await User.findById(decoded.id);
    if(!currentUser)
        return next(new AppError('The user belonging to this token does no longer exist.', 401));
    // check if user changed password after the token was issued
    if(currentUser.changedPasswordAfter(decoded.iat))
        return next(new AppError('User recently changed password! Please log in again.', 401));
    // grant access to protected route
    req.user = currentUser;
    next();
});

