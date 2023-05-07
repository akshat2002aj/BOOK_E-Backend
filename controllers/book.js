const LenderControllers = require('./lender');
const AsyncHandler = require('../middlewares/asyncHandler');
const Book = require('../models/Book');
const ErrorResponse = require('../utils/errorResponse');

class BookControllers extends LenderControllers {
  // @desc      Get All Books
  // @route     GET /api/v1/book
  // @access    Public
  getAllBooks = AsyncHandler(async (req, res, next) => {
    const books = await Book.find();

    res.status(200).json({
      success: true,
      data: books,
    });
  });

  // @desc      Get Single Books
  // @route     GET /api/v1/book/:bookId
  // @access    Public
  getBook = AsyncHandler(async (req, res, next) => {
    const book = await Book.findById(req.params.bookId);

    res.status(200).json({
      success: true,
      data: book,
    });
  });
}

module.exports = BookControllers;
