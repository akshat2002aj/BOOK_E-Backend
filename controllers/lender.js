const AsyncHandler = require('../middlewares/asyncHandler');
const Book = require('../models/Book');
const ErrorResponse = require('../utils/errorResponse');
const path = require('path');
const getDataUri = require('../utils/dataUri');
const cloudinary = require('cloudinary');
const Transaction = require('../models/Transaction');
const Razorpay = require("razorpay");

class LenderControllers {
  // @desc      Add Book
  // @route     POST /api/v1/book
  // @access    Private
  addBook = AsyncHandler(async (req, res, next) => {
    req.body.price = Number(req.body.price);
    req.body.isbn = Number(req.body.isbn);

    var location = {
      type: 'Point',
      coordinates: req.user.location,
    };

    req.body.location = location;
    req.body.user = req.user.id;
    req.body.pincode = req.user.pincode;

    if (!req.file) {
      return next(new ErrorResponse(`Please upload a file`, 400));
    }

    const file = req.file;

    // Make sure the image is a photo
    if (!file.mimetype.startsWith('image')) {
      return next(new ErrorResponse(`Please upload an image  file`, 400));
    }

    // Check filesize
    if (file.size > process.env.MAX_FILE_UPLOAD) {
      return next(
        new ErrorResponse(
          `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
          400
        )
      );
    }

    const fileUri = getDataUri(file);

    const myCloud = await cloudinary.v2.uploader.upload(fileUri.content);

    req.body.image = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };

    const book = await Book.create(req.body);
    res.status(200).json({
      success: true,
      data: book,
    });
  });

  // @desc      Update Book
  // @route     PUT /api/v1/book/:bookId
  // @access    Private only by same user
  updateBook = AsyncHandler(async (req, res, next) => {
    let book = await Book.findById(req.params.bookId);

    if (!book) {
      return next(new ErrorResponse(`Book not found with id`, 404));
    }

    // Make sure user is bootcamp owner
    if (book.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(`User is not authorized to update this bootcamp`, 401)
      );
    }

    book = await Book.findByIdAndUpdate(req.params.bookId, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: book });
  });

  // @desc      Delete Book
  // @route     DELETE /api/v1/book/:bookId
  // @access    Private only by same user
  deleteBook = AsyncHandler(async (req, res, next) => {
    let book = await Book.findById(req.params.bookId);

    if (!book) {
      return next(new ErrorResponse(`Book not found with id`, 404));
    }

    // Make sure user is bootcamp owner
    if (book.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(`User is not authorized to update this bootcamp`, 401)
      );
    }

    book = await Book.findByIdAndDelete(req.params.bookId);

    res.status(200).json({ success: true, data: {} });
  });

  // @desc      Get My Book
  // @route     Get /api/v1/book/my
  // @access    Private only by same user
  getMyBook = AsyncHandler(async (req, res, next) => {
    let books = await Book.find({ user: req.user._id });

    res.status(200).json({ success: true, data: books, count: books.length });
  });

  // @desc      Get My Book
  // @route     Get /api/v1/book/landed
  // @access    Private only by same user
  getAllLandedBooks = AsyncHandler(async(req, res, next)=>{
    let books = await Book.find({ user: req.user._id }).select("_id");
    let transactions = await Transaction.find({
      book: {
        $in : books
      }
    }).select("-deliveredPin")
    res.status(200).json({ success: true, data: transactions, count: books.length });
  })

  // @desc      Get My Book
  // @route     Get /api/v1/book/deliver/:transactionId
  // @access    Private only by same user
  verifyDeliveredOtp = AsyncHandler(async(req, res, next)=>{

    let transaction = await Transaction.findById(req.params.transactionId);

    let book = await Book.findById(transaction.book);

    // console.log(transaction.user.toString(), req.user.id)
    if(book.user.toString() !== req.user.id){
      return res.status(400).json({
        success: false,
        message: "Unauthorized Access"
      })
    }
    if(transaction && transaction.isDelivered == false && transaction.deliveredPin === req.body.pin){
      let returnPin = Math.floor(Math.random() * 100000000);
      await Transaction.findByIdAndUpdate(req.params.transactionId, {
        deliveredAt: Date.now(),
        isDelivered: true,
        message: "Return the book before time else u will have to pay 5Rs per day fine.",
        orderStatus: "Delivered", 
        returnDate: Date.now() + 15 * 24 * 60 * 60 * 1000,
        returnPin: returnPin
      });
      res.status(200).json({
        success: true, 
        data: {},     
        message: "Book Delivered Successfully."
      });
    }else{
      res.status(400).json({
        success: true,
        message: "Verify OTP Error"
      })
    }
  })

    // @desc      Get My Book
  // @route     Get /api/v1/book/return/:transactionId
  // @access    Private only by same user
  VerifyReturnOtp = AsyncHandler(async(req, res, next)=>{
    let transaction = await Transaction.findById(req.params.transactionId);

    if(transaction.user.toString() !== req.user.id){
      return res.status(400).json({
        success: false,
        message: "Unauthorized Access"
      })
    }

    if(transaction && transaction.isDelivered && transaction.isReturned == false && transaction.returnPin === req.body.pin){
      let fine = 0;
      if(Date.now() > transaction.returnAt){
        fine = (Date.now() - transaction.returnAt) / (1000 * 60 * 60 * 24)
        fine = fine * 5
      }

      let refundAmount = transaction.totalPrice - fine - (0.05 * transaction.totalPrice);
      let instance = new Razorpay({
        key_id: process.env.RAZORPAY_ID,
        key_secret: process.env.RAZORPAY_SECRET,
      });

      let data = await instance.payments.refund(transaction.paymentId,{
        "amount": refundAmount * 100,
        "speed": "optimum",
      })
        await Transaction.findByIdAndUpdate(req.params.transactionId, {
          returnAt: Date.now(),
          isReturned: true,
          deliveredPin: null,
          message: `${refundAmount}Rs will be refunded in 5-7 working days.`,
          orderStatus: "Returned",
          fine: fine ,
          refundAmount: refundAmount,
          refundId: data.id
        });

        return res.status(200).json({
          success: true, 
          data: {},
          message: "Book Returned Successfully."
        });
      }else{
        res.status(400).json({
          success: true,
          message: "Verify OTP Error"
        })
      }
  })
}

module.exports = LenderControllers;
