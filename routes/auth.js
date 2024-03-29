const express = require('express');
const AuthController = require('../controllers/auth');
const SingleUpload = require('../middlewares/multer');

const { protect } = require('../middlewares/authHandler');

const router = express.Router();

const Auth = new AuthController();

router.route('/register').post(SingleUpload, Auth.registerUser);
router.route('/login').post(Auth.loginUser);
router.route('/logout').get(protect, Auth.logoutUser);
router.route('/me').get(protect, Auth.getMe);

module.exports = router;
