const mongoose = require('mongoose');

const BookSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Enter book name'],
  },
  author: {
    type: String,
    required: [true, 'Enter author name'],
  },
  isbn: {
    type: Number,
    required: [true, 'Enter ISBN number'],
  },
  availability: {
    type: Boolean,
    default: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Enter User ID'],
  },
  images: [
    {
      type: String,
      required: [true, 'Enter images for book'],
    },
  ],
  price: {
    type: Number,
    required: [true, 'Enter price for book'],
  },
  location: {
    type: {
      type: String,
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      index: '2dsphere',
    },
  },
});

module.exports = mongoose.model('Book', BookSchema);
