const express = require('express');
const { createChat, getAllChat, getAllMessage, createMessage } = require('../controllers/conversation');

const { protect } = require('../middlewares/authHandler');
const router = express.Router();
router
  .route('/')
  .post(protect, createChat)
  .get(protect, getAllChat);
router.route('/:id').get(protect, getAllMessage).post(protect, createMessage)

module.exports = router;
