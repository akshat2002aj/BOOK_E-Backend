const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const ChatSchema = new mongoose.Schema(
  {
    isDisabled: {
      type: Boolean,
      default: false,
    },
    order: {
        type: mongoose.Schema.ObjectId,
        ref: 'Transaction',
        required: [true, 'Enter Order ID'],
    },
    chatName: String,
    timeStamp: {
      type: Date,
      default: Date.now
    },
    user: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
        }
    ]
  },
  {
    timeStamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model('Chat', ChatSchema);
