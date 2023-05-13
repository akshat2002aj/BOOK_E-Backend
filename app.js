const express = require('express');

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const ErrorHandler = require('./middlewares/errorHandler');
const cors = require('cors');
const fileupload = require('express-fileupload');
const path = require('path');

const app = express();

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.json());

app.use(cors({ origin: true, credentials: true }));

// Cookie Parser
app.use(cookieParser());

// File uploading
app.use(fileupload());

// Route Files
const Auth = require('./routes/auth');
const Book = require('./routes/book');
const Transaction = require('./routes/transaction');

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Mount Routes
console.log(1234);
app.use('/api/v1/auth', Auth);
app.use('/api/v1/book', Book);
app.use('/api/v1/transaction', Transaction);

// Error Handler
app.use(ErrorHandler);

module.exports = app;
