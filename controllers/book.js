const LenderControllers = require('./lender');
const AsyncHandler = require('../middlewares/asyncHandler');
const Book = require('../models/Book');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

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

  // @desc      Get Books within radius
  // @route     GET /api/v1/book/:distance
  // @access    Private
  getBooksWithInRadius = AsyncHandler(async (req, res, next) => {
    const { distance } = req.params;
    let loc = req.user.location.coordinates;
    console.log(loc);
    const lat = loc[1];
    const lng = loc[0];

    // Calc radius using radians
    // Divide dist by radius of Earth
    // Earth Radius = 3,963 mi / 6,378 km
    const radius = Number(distance) / 6378;

    let user = await User.find({
      location: {
        $geoWithin: { $centerSphere: [[lng, lat], radius] },
      },
    });
    let userId = [];

    user.map((data) => {
      if(data._id.toString()!== req.user.id)
          userId.push(data._id)
    });

    userId.pop(req.user.id);

    let book = await Book.find({ user: { $in: userId } });

    // console.log(user);
    // let book = await Book.find().populate('user');
    // // console.log(book);
    // book = await Book.find({
    //   'user.location': {
    //     $geoWithin: { $centerSphere: [[lng, lat], radius] },
    //   },
    // });
    // // console.log(book);
    // // .lean();
    // // book = await book.exec();

    res.status(200).json({
      success: true,
      data: book,
      count: book.length,
    });
  });
}

module.exports = BookControllers;
