const express = require('express');

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const ErrorHandler = require('./middlewares/errorHandler');

const app = express();

// Body Parser
app.use(express.json());
app.use(bodyParser.json());

// Cookie Parser
app.use(cookieParser());

// Route Files
const Auth = require('./routes/auth');
const Book = require('./routes/book');

// Mount Routes
app.use('/api/v1/auth', Auth);
app.use('/api/v1/book', Book);

// Error Handler
app.use(ErrorHandler);

module.exports = app;
