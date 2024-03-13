const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
// const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
// const cookieParser = require('cookie-parser');
const compression = require('compression');

const scheduleRouter = require('./routes/scheduleRouter');
const userRouter = require('./routes/userRouter');
const errorController = require('./controllers/errorController');
const AppError = require('./utils/AppError');

const app = express();

if(process.env.NODE_ENV === 'development')
    app.use(morgan('dev'));

app.use(helmet());
app.use(cors());

app.use(express.json({limit: '10kb'}));


const limiter = rateLimit({
    max: 2000,
    windowMs: 10 * 60 * 1000,
    message: 'هناك الكثير من الطلبات الرجاء المحاوله مره اخرى خلال 10 دقيقه'
});
app.use('/api', limiter);


app.use(mongoSanitize());
app.use(xss());
// app.use(hpp());
// app.use(cookieParser());
app.use(compression());


app.use('/api/v1/users', userRouter);
app.use('/api/v1/schedules', scheduleRouter);

app.all('*', (req, res, next) => {
    return next(new AppError(`غير موجود`, 404));
});

app.use(errorController);

module.exports = app;
