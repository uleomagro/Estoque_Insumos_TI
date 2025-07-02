const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,        // garante que cada código seja único
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  mark: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  model: {
    type: String,
    trim: true,
    default: 'N/A'
  },
  cost: {
    type: Number,
    min: 0,
    default: 0
  },
  stock: {
    type: Number,
    required: true,
    min: 0
  },
  minStock: {
    type: Number,
    min: 0,
    default: 0
  },
  description: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', productSchema);
