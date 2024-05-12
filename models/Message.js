const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const MessageSchema = new mongoose.Schema(
  {
    chatId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Chat',
        required: [true, 'Enter Chat ID'],
    },
    sender: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Enter Sender ID'],
    },
    receiver: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Enter Receiver ID'],
    },
    message: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
  },
);

module.exports = mongoose.model('Message', MessageSchema);
