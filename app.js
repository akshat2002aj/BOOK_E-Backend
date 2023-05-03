const express = require('express');

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const app = express();

// Body Parser
app.use(express.json());
app.use(bodyParser);

// Cookie Parser
app.use(cookieParser());

module.exports = app;
