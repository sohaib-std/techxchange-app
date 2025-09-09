const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId, // This will store the ID of a Seller document
    ref: 'Seller', // This links this field to the Seller model
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);