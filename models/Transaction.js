const mongoose = require('mongoose');

const TransactionSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  book: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Book',
      required: true,
    },
  ],
  pin: {
    type: Number,
    required: true,
  },
  paymentInfo: {
    id: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  paidAt: {
    type: Date,
    required: true,
  },
  refundAt: {
    type: Date,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  orderStatus: {
    type: String,
    required: true,
    default: 'Processing',
  },
  deliveredAt: Date,
  returnDate: {
    type: Date,
    default: new Date(
      Date.now() + process.env.BOOK_RETURN_DATE * 24 * 60 * 60 * 1000
    ),
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Transaction', TransactionSchema);
