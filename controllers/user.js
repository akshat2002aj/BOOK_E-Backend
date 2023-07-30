const AsyncHandler = require('../middlewares/asyncHandler');
const User = require('../models/User');
const Book = require('../models/Book');
const ErrorResponse = require('../utils/errorResponse');
const getDataUri = require('../utils/dataUri');
const cloudinary = require('cloudinary');

class UserController {
  // @desc      Update user
  // @route     PUT /api/v1/users/:id
  // @access    Private/Admin
  updateUser = AsyncHandler(async (req, res, next) => {
    const data = await User.findById(req.user.id);
    if (data.role !== 'admin' && data._id !== req.params.userId) {
      return next(new ErrorResponse('You cannot update this profile', 400));
    }
    if (req.file) {
      const file = req.file;

      // Make sure the image is a photo
      if (!file.mimetype.startsWith('image')) {
        return next(new ErrorResponse(`Please upload an image  file`, 400));
      }

      // Check filesize
      if (file.size > process.env.MAX_FILE_UPLOAD) {
        console.log(file.size);
        return next(
          new ErrorResponse(
            `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
            400
          )
        );
      }

      const fileUri = getDataUri(file);

      const myCloud = await cloudinary.v2.uploader.upload(fileUri.content);
      req.body.avatar = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };
    }
    const user = await User.findByIdAndUpdate(req.params.userId, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: user,
    });
  });
}

module.exports = UserController;
