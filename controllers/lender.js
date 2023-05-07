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
}

module.exports = LeenderControllers;
