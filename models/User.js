const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter your name'],
      maxLength: [40, 'Name cannot exceed 40 characters'],
      minLength: [4, 'Name must be at least 4 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please enter your email'],
      unique: true,
      validate: [validator.isEmail, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Please enter your password'],
      minLength: [8, 'Password must be at least 8 characters'],
      select: false,
    },
    avatar: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: 'User',
      enum: ['User', 'Admin'],
    },
    address: {
      street: {
        type: String,
        required: [true, 'Please enter street name'],
      },
      city: {
        type: String,
        required: [true, 'Please enter city name'],
      },
      state: {
        type: String,
        required: [true, 'Please enter state name'],
      },
      country: {
        type: String,
        required: [true, 'Please enter country name'],
      },
      pincode: {
        type: Number,
        required: [true, 'Please enter pincode'],
      },
      coordinates: {
        type: [Number],
        required: [true, 'Please enter coordinates'],
      },
    },
    phone: {
      type: Number,
      required: [true, 'Please enter phone number'],
    },
    confirmEmailToken: String,
    isEmailConfirmed: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timeStamps: true,
  }
);

module.exports = mongoose.model('User', UserSchema);
