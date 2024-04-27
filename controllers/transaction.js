const AsyncHandler = require('../middlewares/asyncHandler');
const Transaction = require('../models/Transaction');
const ErrorResponse = require('../utils/errorResponse');
const Razorpay = require("razorpay");
const Book = require('../models/Book');
// console.log(process.env.PORT)
class TransactionController {

  // @desc      Create a transaction
  // @route     POST /api/v1/transaction
  // @access    Private
  createTransaction = AsyncHandler(async (req, res, next) => {

    const { book, paymentId } = req.body;

    let deliveredPin = Math.floor(Math.random() * 100000000);
    let instance = new Razorpay({
      key_id: process.env.RAZORPAY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    const payment = await instance.payments.fetch(paymentId)

    const transaction = await Transaction.create({
      user: req.user._id,
      book,
      deliveredPin,
      paymentId,
      totalPrice: payment.amount / 100,
      isPaid: payment.status === 'captured' ? true : false,
      paidAt: Date.now(),
      message: "Use the delivery pin to take book from the owner at the mention address.",
    });

    const data = await Book.findByIdAndUpdate(book,{
      availability: false
    })

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
    });

    res.status(201).json({
      success: true,
      data,
    });
  });

  allOrder = AsyncHandler(async (req, res, next) => {
    const data = await Transaction.find({
      user: req.user._id
    }).select("-returnPin").populate("book", "name image price")

    res.status(201).json({
      success: true,
      data,
    });
  });

  oneOrder = AsyncHandler(async (req, res, next) => {

    const transaction = await Transaction.findById(req.params.id).populate('user','address phone name pincode').populate("book", "name image price");
    console.log(transaction.user.id.toString(), req.user.id)
    if(transaction.user.id.toString() !== req.user.id){
      console.log(1122345)
      res.status(201).json({
        success: true,
        data: {
          ...transaction._doc,
          deliveredPin: null
        },
      });
    }else{
      let book = await Book.findById(transaction.book).populate('user','address phone name pincode');
      res.status(201).json({
        success: true,
        data: {
          ...transaction._doc,
          user: book.user,
          returnPin: null
        },
      });
    }
  });
}

module.exports = TransactionController;
