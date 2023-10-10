const express = require('express');
const TransactionControllers = require('../controllers/transaction');
const BorrowerControllers = require('../controllers/borrower');

const { protect } = require('../middlewares/authHandler');

const Transaction = new TransactionControllers();
const Borrower = new TransactionControllers();

const router = express.Router();

router.route('/').post(protect, Transaction.createTransaction);
router.route('/payment/process').post(Borrower.createOrder)

module.exports = router;
