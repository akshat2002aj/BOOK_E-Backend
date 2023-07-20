const AsyncHandler = require('../middlewares/asyncHandler');
const Transaction = require('../models/Transaction');
const ErrorResponse = require('../utils/errorResponse');

class TransactionController {
  // @desc      Create a transaction
  // @route     POST /api/v1/transaction
  // @access    Private
  createTransaction = AsyncHandler(async (req, res, next) => {
    const { books, paymentInfo, totalPrice, itemPrice } = req.body;

    let pin = Math.floor(Math.random() * 1000000);

    const transaction = await Transaction.create({
      books,
      pin,
      paymentInfo,
      itemPrice,
      totalPrice,
      user: req.user._id,
    });

    res.status(201).json({
      success: true,
      data: transaction,
    });
  });
}

module.exports = TransactionController;
