

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
    console.error('Error Happened: ', err);
    console.error('Error Message: ', err.message);
    return res.status(500).json({
        status: 'error',
        message: 'حدث خطأ ما الرجاء المحاوله مره اخرى'
    });
}


// Error handler
module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    if(process.env.NODE_ENV === 'development')
        return sendErrorDev(err, req, res);
    else if(process.env.NODE_ENV === 'production')
    {
        
        return sendErrorProd(err, req, res);
    }
}