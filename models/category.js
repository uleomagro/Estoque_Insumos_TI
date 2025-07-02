const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  estoqueMinimo: {
    type: Number,
    required: true,
    min: 0
  }
});

module.exports = mongoose.model('Category', CategorySchema);
