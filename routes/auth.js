const express = require('express');
const AuthController = require('../controllers/auth');

const router = express.Router();

const Auth = new AuthController();

router.route('/register').post(Auth.registerUser);

module.exports = router;
