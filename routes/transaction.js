const express = require('express');
const TransactionControllers = require('../controllers/transaction');
const BorrowerControllers = require('../controllers/borrower');

const { protect } = require('../middlewares/authHandler');

const Transaction = new TransactionControllers();
const Borrower = new TransactionControllers();

const router = express.Router();

router.route('/').post(protect, Transaction.createTransaction);
router.route('/allOrder').get(protect, Borrower.allOrder)
router.route('/payment/process').post(protect, Borrower.createOrder);
router.route('/:id').get(protect, Borrower.oneOrder);

module.exports = router;
