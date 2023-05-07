const express = require('express');
const LenderController = require('../controllers/lender');

const { protect } = require('../middlewares/authHandler');

const Lender = new LenderController();

const router = express.Router();

router.route('/').post(protect, Lender.addBook);

module.exports = router;
