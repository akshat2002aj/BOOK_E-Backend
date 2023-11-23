const AsyncHandler = require('../middlewares/asyncHandler');
const Transaction = require('../models/Transaction');
const ErrorResponse = require('../utils/errorResponse');
const Razorpay = require("razorpay");
// console.log(process.env.PORT)
class TransactionController {

  // @desc      Create a transaction
  // @route     POST /api/v1/transaction
  // @access    Private
  createTransaction = AsyncHandler(async (req, res, next) => {
    console.log(process.env.PORT)
    const { book, paymentId, totalPrice, itemPrice } = req.body;

    let pin = Math.floor(Math.random() * 1000000);
    let instance = new Razorpay({
      key_id: process.env.RAZORPAY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    const payment = await instance.payments.fetch(paymentId)
    console.log(payment);

    const transaction = await Transaction.create({
      user: req.user._id,
      book,
      pin,
      paymentId,
      totalPrice,
      returnDate: Date.now() + 7 * 24 * 60 * 60 * 1000
    });

    res.status(201).json({
      success: true,
      data: transaction,
    });
  });

  createOrder = AsyncHandler(async (req, res, next) => {
    let instance = new Razorpay({
      key_id: process.env.RAZORPAY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    const data = await instance.orders.create({
      amount: req.body.amount,
      currency: "INR",
      receipt: "receipt#1",
      partial_payment: false,
      notes: {
        key1: "value3",
        key2: "value2",
      },
    });

    res.status(201).json({
      succes: true,
      data,
    });
  });
}

module.exports = TransactionController;
