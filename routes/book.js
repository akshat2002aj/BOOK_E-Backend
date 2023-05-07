const express = require('express');
const BookController = require('../controllers/book');

const { protect } = require('../middlewares/authHandler');

const Book = new BookController();

const router = express.Router();

router.route('/').post(protect, Book.addBook).get(Book.getAllBooks);
router
  .route('/:bookId')
  .put(protect, Book.updateBook)
  .delete(protect, Book.deleteBook)
  .get(Book.getBook);

module.exports = router;
