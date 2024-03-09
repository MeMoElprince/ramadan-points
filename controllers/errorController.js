const AppError = require('../utils/AppError');

const sendErrorDev = (err, req, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        statusCode: err.statusCode,
        message: err.message,
        stack: err.stack,
        error: err
    })
}

const sendErrorProd = (err, req, res) => {
    if(err.isOperational){
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        })
    }
    console.error('Error Happened: ', {err});
    const message = err.message;
    console.error('Error Message: ', {message});
    return res.status(500).json({
        status: 'error',
        message: 'حدث خطأ ما الرجاء المحاوله مره اخرى'
    });
}

const handleDublicateFieldsDB = (err) => {
    if(Object.keys(err.keyValue)[0] === 'email')
        return new AppError('هذا المستخدم (الايميل) موجود بالفعل', 400);
    const value = Object.values(err.keyValue);
    const message = `قيمه مكرره: ${value}. الرجاء استخدام قيمه اخرى`;
    return new AppError(message, 400);
}

const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `بيانات غير صحيحه: ${errors.join('. ')}`;
    return new AppError(message, 400);
}

const handleJWTError = (err) => new AppError('الرمز غير صحيح. الرجاء تسجيل الدخول مره اخرى', 401);
const handleJWTExpiredError = (err) => new AppError('انتهت صلاحيه الرمز. الرجاء تسجيل الدخول مره اخرى', 401);
const handleCastErrorDB = (err) => {
    const message = `قيمه غير صحيحه ${err.path}: ${err.value}`;
    return new AppError(message, 400);
}

// Error handler
module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    if(process.env.NODE_ENV === 'development')
        return sendErrorDev(err, req, res);
    else if(process.env.NODE_ENV === 'production')
    {
        let error = {...err};
        error.message = err.message;
        
        if(error.code === 11000)
            error = handleDublicateFieldsDB(error);

        // if(error.name === 'ValidationError')
        //     error = handleValidationErrorDB(error);

        if(error.name === 'JsonWebTokenError')
            error = handleJWTError(error);

        if(error.name === 'TokenExpiredError')
            error = handleJWTExpiredError(error);
        
        if(error.name === 'CastError')
            error = handleCastErrorDB(error);
        
        // if(error.name === 'AppError')
        //     error = handleAppError(error);

        // if(error.name === 'TypeError')
        //     error = handleTypeError(error);

        // if(error.name === 'RangeError')
        //     error = handleRangeError(error);

        return sendErrorProd(error, req, res);
    }
}