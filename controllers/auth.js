const AsyncHandler = require('../middlewares/asyncHandler');
const User = require('../models/User');

class AuthController {
  registerUser = AsyncHandler(async (req, res, next) => {
    // Create user
    const user = await User.create(req.body);

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
