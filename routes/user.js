const express = require('express');
const UserController = require('../controllers/user');
const SingleUpload = require('../middlewares/multer');

const { protect } = require('../middlewares/authHandler');

const router = express.Router();

const User = new UserController();

router.route('/:userId').put(protect, SingleUpload, User.updateUser);

module.exports = router;
