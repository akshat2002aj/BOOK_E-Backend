const express = require('express');
const TransactionControllers = require('../controllers/transaction');

const { protect } = require('../middlewares/authHandler');

const Transaction = new TransactionControllers();

const router = express.Router();

router.route('/').post(protect, Transaction.createTransaction);

module.exports = router;
