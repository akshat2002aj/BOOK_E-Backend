const AsyncHandler = require("../middlewares/asyncHandler");
const Book = require("../models/Book");
const ErrorResponse = require("../utils/errorResponse");
const path = require("path");
// const Razorpay = require("razorpay");

// var instance = new Razorpay({
//   key_id: process.env.RAZORPAY_ID,
//   key_secret: process.env.RAZORPAY_SECRET,
// });

class BorrowerControllers {
  createOrder = AsyncHandler(async (req, res, next) => {
    const data = instance.orders.create({
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

module.exports = BorrowerControllers;
