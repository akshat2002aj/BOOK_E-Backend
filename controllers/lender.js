const AsyncHandler = require('../middlewares/asyncHandler');
const Book = require('../models/Book');
const ErrorResponse = require('../utils/errorResponse');
const path = require('path');
const getDataUri = require('../utils/dataUri');
const cloudinary = require('cloudinary');

class LeenderControllers {
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

    res.status(200).json({ success: true, data: { books }, count: books.length });
  });
}

module.exports = LeenderControllers;
