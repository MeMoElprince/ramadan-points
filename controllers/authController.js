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
    await user.save({validateBeforeSave: false});
    res.redirect(`${process.env.URL_FRONTEND}`);
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
    const token = await tokenFactory.sign({id: newUser._id});
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
        return next(new AppError('حدث خطأ أثناء إرسال التحقق من البريد الإلكتروني. حاول مرة أخرى في وقت لاحق!', 500));
    }
});
    
exports.login = catchAsync(async (req, res, next) => {
    const {save} = req.query;
    const {email, password} = req.body;
    // check if email and password exist
    if(!email || !password)
        return next(new AppError('يرجى تقديم البريد الإلكتروني وكلمة المرور معا', 400));
    // check if user exists and password is correct
    const user = await User.findOne({email}).select('+password +active');
    if(!user || !await user.correctPassword(password, user.password))
        return next(new AppError('البريد الاكتروني أو كلمة مرورغير صحيحة', 401));
    // if everything is ok, send token to client
    const token = await tokenFactory.sign({id: user._id}, process.env.JWT_SECRET, save === 'true' ? '40d' : '1d');
    user.token = token;
    await user.save({validateBeforeSave: false});
    if(!user.active)
    {
        try{
            const url = `${req.protocol}://${req.get('host')}/api/v1/users/verifyMe/${token}`;
            const sendEmail = new Email(user, url).sendVerification();
            await Promise.race([sendEmail, 15000]);
            return next(new AppError('لم يتم تفعيل حسابك بعد، لقد أرسلنا لك رسالة تفعيل، تحقق من بريدك الإلكتروني', 401));
        } catch (err)
        {
            return next(new AppError('لم يتم التحقق من حسابك بعد، كما حدث خطأ أثناء إرسال التحقق من البريد الإلكتروني. حاول مرة أخرى في وقت لاحق!', 500));
        }
    }
    res.status(200).json({
        status: 'success',
        data: {
            token
        }
    });
});

exports.loggedIn = catchAsync(async (req, res, next) => {
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
        token = req.headers.authorization.split(' ')[1];
    if(!token)
        return next();
    // verification token
    const decoded = await tokenFactory.verify(token);
    // check if user still exists
    const currentUser = await User.findById(decoded.id).select('+active');
    if(!currentUser)
        return next();
    // check if user changed password after the token was issued
    if(currentUser.changedPasswordAfter(decoded.iat))
        return next();
    // grant access to protected route
    if(!currentUser.active)
        return next();
    // checking if the user has a token
    if(currentUser.token !== token)
        return next();
    req.user = currentUser;
    next();
});

exports.protect = catchAsync(async (req, res, next) => {
    // getting token and check if it exists
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
        token = req.headers.authorization.split(' ')[1];
    if(!token)
        return next(new AppError('لم يتم دخولك! الرجاء تسجيل الدخول لتتمكن من الوصول.', 401));
    // verification token
    const decoded = await tokenFactory.verify(token);
    // check if user still exists
    const currentUser = await User.findById(decoded.id).select('+active');
    if(!currentUser)
        return next(new AppError('المستخدم الذي ينتمي إلى هذا الرمز المميز لم يعد موجودًا.', 401));
    // check if user changed password after the token was issued
    if(currentUser.changedPasswordAfter(decoded.iat))
        return next(new AppError('قام المستخدم مؤخرًا بتغيير كلمة المرور! الرجاد الدخول على الحساب من جديد.', 401));
    // grant access to protected route
    if(!currentUser.active)
        return next(new AppError('لم يتم التحقق من حسابك بعد!', 401));
    // checking if the user has a token
    if(currentUser.token !== token)
        return next(new AppError('لم يتم دخولك! الرجاء تسجيل الدخول لتتمكن من الوصول.', 401));
    
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
        return next(new AppError('لا يوجد مستخدم لديه عنوان بريد إلكتروني هذا', 404));
    // generate the random reset token and save it to DB
    const resetToken = user.createPasswordResetToken();
    await user.save({validateBeforeSave: false});
    // send it to user's email
    try{
        const sendEmail = new Email(user, resetToken).sendResetPassword();
        await Promise.race([sendEmail, 15000]);
        res.status(200).json({
            status: 'success',
            message: 'Token sent to email'
        });
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({validateBeforeSave: false});
        return next(new AppError('حدث خطأ في إرسال البريد الإلكتروني. حاول مرة أخرى في وقت لاحق!', 500));
    }
});

exports.resetToken = catchAsync(async (req, res, next) => {
    // get user based on the token
    const hashedToken = crypto.createHash('sha256').update(req.body.token).digest('hex');
    const user = await User.findOne({passwordResetToken: hashedToken, passwordResetExpires: {$gt: Date.now()}});
    // if token has not expired and there is user, send the token to the client
    if(!user)
        return next(new AppError('الرمز غير صالح أو انتهت صلاحيته', 400));
    res.status(200).json({
        status: 'success',
        data: {
            token: req.params.token
        }
    });
});

exports.resetPassword = catchAsync(async (req, res, next) => { 
    // get user based on the token
    const hashedToken = crypto.createHash('sha256').update(req.body.token).digest('hex');
    const user = await User.findOne({passwordResetToken: hashedToken, passwordResetExpires: {$gt: Date.now()}});
    // if token has not expired and there is user, set the new password
    if(!user)
        return next(new AppError('الرمز غير صالح أو انتهت صلاحيته', 400));
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