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

// Mount Routes
app.use('/api/v1/auth', Auth);

// Error Handler
app.use(ErrorHandler);

module.exports = app;
