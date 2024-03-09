const crypto = require('crypto');

const User = require('../models/userModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const tokenFactory = require('../utils/tokenFactory');
const Email = require('../utils/email');


// i will make it patch soon

exports.verifyMe = catchAsync(async (req, res, next) => {
    const {token} = req.params;
    const decoded = await tokenFactory.verify(token);
    const user = await User.findById(decoded.id).select('+active');
    if(!user) return next(new AppError('User not found', 404));
    if(user.token !== token) return next(new AppError('Invalid token', 400));
    user.token = undefined;
    await user.save({validateBeforeSave: false});
    if(user.active) return res.status(200).send(`<h1>Your account has been verified already!</h1>`);
    user.active = true;
    res.status(200).send(`<h1>Your account has been verified successfully!</h1> <br> <h2> You can login now..</h2>`);
});

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
    newUser.token = token;
    await newUser.save({validateBeforeSave: false});
    // sending email and response
    try{
        const url = `${req.protocol}://${req.get('host')}/api/v1/users/verifyMe/${token}`;
        const sendEmail = new Email(newUser, url).sendVerification();
        await Promise.race([sendEmail, 15000]);
        // sending response
        res.status(201).json({
            status: 'success',
            data: {
                user: newUser
            }
        });
    }
    catch (err) {
        await User.findByIdAndDelete(newUser._id);
        return next(new AppError('There was an error sending the email verification. Try again later!', 500));
    }
});
    
exports.login = catchAsync(async (req, res, next) => {
    const {save} = req.query;
    const {email, password} = req.body;
    // check if email and password exist
    if(!email || !password)
        return next(new AppError('Please provide email and password together', 400));
    // check if user exists and password is correct
    const user = await User.findOne({email}).select('+password +active');
    if(!user || !await user.correctPassword(password, user.password))
        return next(new AppError('Incorrect email or password', 401));
    // if everything is ok, send token to client
    const token = tokenFactory.sign({id: user._id}, process.env.JWT_SECRET, save === 'true' ? '40d' : '1d');
    user.token = token;
    await user.save({validateBeforeSave: false});
    if(!user.active)
    {
        try{
            const url = `${req.protocol}://${req.get('host')}/api/v1/users/verifyMe/${token}`;
            const sendEmail = new Email(user, url).sendVerification();
            await Promise.race([sendEmail, 15000]);
            return next(new AppError('Your account has not been verified yet, we have sent you a verification message, check your email', 401));
        } catch (err)
        {
            return next(new AppError('Your account has not been verified yet and aloso there was an error sending the email verification. Try again later!', 500));
        }
    }
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
    const currentUser = await User.findById(decoded.id).select('+active');
    if(!currentUser)
        return next(new AppError('The user belonging to this token does no longer exist.', 401));
    // check if user changed password after the token was issued
    if(currentUser.changedPasswordAfter(decoded.iat))
        return next(new AppError('User recently changed password! Please log in again.', 401));
    // grant access to protected route
    if(!currentUser.active)
        return next(new AppError('Your account has not been verified yet!', 401));
    // checking if the user has a token
    if(currentUser.token !== token)
        return next(new AppError('You are not logged in! Please log in to get access.', 401));
    req.user = currentUser;
    next();
});

exports.logout = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    user.token = undefined;
    await user.save({validateBeforeSave: false});
    res.status(200).json({
        status: 'success',
        data: null
    });
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
    // get user based on posted email
    const user = await User.findOne({email: req.body.email});
    if(!user)
        return next(new AppError('There is no user with email address', 404));
    // generate the random reset token and save it to DB
    const resetToken = user.createPasswordResetToken();
    await user.save({validateBeforeSave: false});
    // send it to user's email
    try{
        const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
        const sendEmail = new Email(user, resetURL).sendResetPassword();
        await Promise.race([sendEmail, 15000]);
        res.status(200).json({
            status: 'success',
            message: 'Token sent to email'
        });
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({validateBeforeSave: false});
        return next(new AppError('There was an error sending the email. Try again later!', 500));
    }
});

exports.resetPassword = catchAsync(async (req, res, next) => { 
    // get user based on the token
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({passwordResetToken: hashedToken, passwordResetExpires: {$gt: Date.now()}});
    // if token has not expired and there is user, set the new password
    if(!user)
        return next(new AppError('Token is invalid or has expired', 400));
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    // update changedPasswordAt property for the user
    // log the user in, send JWT
    const token = tokenFactory.sign({id: user._id});
    user.token = token;
    await user.save({validateBeforeSave: false});
    res.status(200).json({
        status: 'success',
        data: {
            token
        }
    });
});