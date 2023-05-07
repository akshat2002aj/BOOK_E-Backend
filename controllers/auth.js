const AsyncHandler = require('../middlewares/asyncHandler');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

class AuthController {
  // @desc      Register a user
  // @route     POST /api/v1/auth/register
  // @access    Public
  registerUser = AsyncHandler(async (req, res, next) => {
    // Create user
    const user = await User.create(req.body);

    sendTokenResponse(user, 200, res);
  });

  // @desc      Login a user
  // @route     POST /api/v1/auth/login
  // @access    Public
  loginUser = AsyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    // Validate emil & password
    if (!email || !password) {
      return next(
        new ErrorResponse('Please provide an email and password', 400)
      );
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    sendTokenResponse(user, 200, res);
  });
}

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
  });
};

module.exports = AuthController;
