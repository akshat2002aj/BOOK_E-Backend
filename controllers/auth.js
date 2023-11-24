const AsyncHandler = require('../middlewares/asyncHandler');
const User = require('../models/User');
const Book = require('../models/Book');
const ErrorResponse = require('../utils/errorResponse');
const Transaction = require('../models/Transaction');

class AuthController {
  // @desc      Register a user
  // @route     POST /api/v1/auth/register
  // @access    Public
  registerUser = AsyncHandler(async (req, res, next) => {
    let { name, email, password, phone, address, pincode, location } = req.body;
    phone = Number(phone);
    location = location.split(',');
    location[0] = Number(location[0]);
    location[1] = Number(location[1]);
    pincode = Number(pincode);

    let user = await User.findOne({ email: req.body.email });

    if (user) {
      return res.status(400).json({
        success: false,
        message: 'User already exist',
      });
    }
    user = await User.create({
      name,
      email,
      password,
      address,
      phone,
      location: {
        type: 'Point',
        coordinates: location,
      },
      pincode,
    });
    sendTokenResponse(user, 200, res);

    // console.log(user);
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

  // @desc      Log user out / clear cookie
  // @route     GET /api/v1/auth/logout
  // @access    Public
  logoutUser = AsyncHandler(async (req, res, next) => {
    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
      data: {},
    });
  });

  // @desc      Get current logged in user
  // @route     GET /api/v1/auth/me
  // @access    Private
  getMe = AsyncHandler(async (req, res, next) => {
    // user is already available in req due to the protect middleware
    const user = req.user;
    const Books = await Book.find({ user: user._id });
    const transaction = await Transaction.find({
      user: user._id
    })
    // console.log(user);
    const userData = {
      ...user,
      booksAdded: Books.length,
    };
    // console.log(userData);
    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        address: user.address,
        pincode: user.pincode,
        location: user.location,
        phone: user.phone,
        isEmailConfirmed: user.isEmailConfirmed,
        booksAdded: Books.length,
        booksOrdered: transaction.length
      },
    });
  });
}

// Get token from model, create cookie and send response
const sendTokenResponse = async (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  const Books = await Book.find({ user: user._id });

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        address: user.address,
        pincode: user.pincode,
        location: user.location,
        phone: user.phone,
        isEmailConfirmed: user.isEmailConfirmed,
        booksAdded: Books.length,
      },
    });
};

module.exports = AuthController;
