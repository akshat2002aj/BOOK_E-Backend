const mongoose = require('mongoose');

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
    default: 'Education',
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
  image: {
    public_id: String,
    url: String,
  },
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
