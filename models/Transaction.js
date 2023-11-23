const mongoose = require("mongoose");

const TransactionSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  book: {
    type: mongoose.Schema.ObjectId,
    ref: "Book",
    required: true,
  },
  pin: {
    type: Number,
    required: true,
  },
  paymentId: {
    type: String,
    required: true,
  },
  paidAt: {
    type: Date,
  },
  refundAt: {
    type: Date,
  },
  fine: {
    type: Number,
    default: 0,
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  orderStatus: {
    type: String,
    default: "Processing",
  },
  deliveredAt: Date,
  returnDate: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  isDelivered: {
    type: Boolean,
    default: false,
  },
  isReturned: {
    type: Boolean,
    default: false,
  }
});

module.exports = mongoose.model("Transaction", TransactionSchema);
