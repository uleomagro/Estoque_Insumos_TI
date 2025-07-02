const mongoose = require('mongoose');

const movementSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  type: {
    type: String,
    enum: ['entrada', 'saida'],
    required: true
  },
  technician: {
    type: String,
    enum: ['Renan Muniz', 'Leonardo Rosseti'],
    required: true
  },
  destinatario: {
    type: String,
    trim: true,
    required: false   // marque como required ou false, conforme preferir
  },
  quantity: {
    type: Number,
    required: true   // passa a exigir quantidade
  },
  observation: {
    type: String,
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Movement', movementSchema);
