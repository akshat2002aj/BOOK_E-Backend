const AsyncHandler = require('../middlewares/asyncHandler');
const Book = require('../models/Book');
const ErrorResponse = require('../utils/errorResponse');
const path = require('path');

class BorrowerControllers {
  // @desc      Get Books within radius
  // @route     GET /api/v1/book/:distance
  // @access    Private
  getBooksWithInRadius = AsyncHandler(async (req, res, next) => {
    const { zipcode, distance } = req.params;
    let loc = req.user.location;
    const lat = loc[1];
    const lng = loc[0];

    // Calc radius using radians
    // Divide dist by radius of Earth
    // Earth Radius = 3,963 mi / 6,378 km
    const radius = distance / 3963;

    const bootcamps = await Book.find({
      location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
    });
  });
}

module.exports = BorrowerControllers;
