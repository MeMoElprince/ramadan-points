const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');

const userRouter = require('./routes/userRouter');

const app = express();

if(process.env.NODE_ENV === 'development')
    app.use(morgan('dev'));

app.use(helmet());
app.use(cors());

app.use(express.json());

app.use('/api/v1/users', userRouter);


app.all('*', (req, res) => {
    res.status(404).json({
        status: 'fail',
        message: 'Invalid URL. Please check the URL and try again.'
    });
});


app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).json({
        status: 'error',
        message: 'Internal Server Error. Please try again later.'
    });
});

module.exports = app;