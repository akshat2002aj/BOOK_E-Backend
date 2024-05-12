const express = require('express');
const { createChat, getAllChat } = require('../controllers/conversation');

const { protect } = require('../middlewares/authHandler');
const router = express.Router();
router
  .route('/')
  .post(protect, createChat)
  .get(protect, getAllChat);

module.exports = router;
