const AsyncHandler = require('../middlewares/asyncHandler');
const Book = require('../models/Book');
const ErrorResponse = require('../utils/errorResponse');

class LeenderControllers {
  // @desc      Add Book
  // @route     POST /api/v1/book
  // @access    Private
  addBook = AsyncHandler(async (req, res, next) => {
    req.body.location.coordinates = req.user.location;
    req.body.user = req.user.id;

    // Create user
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
}

module.exports = LeenderControllers;
