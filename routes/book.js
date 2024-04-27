const express = require('express');
const BookController = require('../controllers/book');
const LenderControllers = require('../controllers/lender')

const { protect } = require('../middlewares/authHandler');
const singleUpload = require('../middlewares/multer');

const Book = new BookController();
const Lender = new LenderControllers();
const router = express.Router();

router
  .route('/')
  .post(protect, singleUpload, Book.addBook)
  .get(Book.getAllBooks);
router.route('/my').get(protect, Book.getMyBook);
router.route('/landed').get(protect, Lender.getAllLandedBooks);
router.route('/deliver/:transactionId').post(protect, Lender.verifyDeliveredOtp);
router.route('/return/:transactionId').post(protect, Lender.VerifyReturnOtp);
router
  .route('/:bookId')
  .put(protect, Book.updateBook)
  .delete(protect, Book.deleteBook)
  .get(Book.getBook);

router.route('/radius/:distance').get(protect, Book.getBooksWithInRadius);

module.exports = router;
