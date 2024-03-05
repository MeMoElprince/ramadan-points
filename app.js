const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');



const app = express();

if(process.env.NODE_ENV === 'development')
    app.use(morgan('dev'));

app.use(helmet());
app.use(cors());

app.use(express.json());




module.exports = app;