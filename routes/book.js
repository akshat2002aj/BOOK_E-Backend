const express = require('express');
const BookController = require('../controllers/book');

const { protect } = require('../middlewares/authHandler');
const singleUpload = require('../middlewares/multer');

const Book = new BookController();

const router = express.Router();

router
  .route('/')
  .post(protect, singleUpload, Book.addBook)
  .get(Book.getAllBooks);
router.route('/my').get(protect, Book.getMyBook);
router
  .route('/:bookId')
  .put(protect, Book.updateBook)
  .delete(protect, Book.deleteBook)
  .get(Book.getBook);

router.route('/radius/:distance').get(protect, Book.getBooksWithInRadius);

module.exports = router;
