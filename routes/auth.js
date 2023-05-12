const express = require('express');
const AuthController = require('../controllers/auth');

const { protect } = require('../middlewares/authHandler');

const router = express.Router();

const Auth = new AuthController();

router.route('/register').post(Auth.registerUser);
router.route('/login').post(Auth.loginUser);
router.route('/logout').get(protect, Auth.logoutUser);
router.route('/me').get(protect, Auth.getMe);

module.exports = router;
