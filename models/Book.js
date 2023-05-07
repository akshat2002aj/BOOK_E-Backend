const mongoose = require('mongoose');
const geocoder = require('../utils/geocoder');

const BookSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Enter book name'],
  },
  description: {
    type: String,
    required: [true, 'Enter description'],
  },
  category: {
    type: String,
    required: [true, 'Enter category name'],
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
  pincode: {
    type: Number,
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
