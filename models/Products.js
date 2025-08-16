// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    image: {
      type: String,
      required: [true, 'Image URL is required'],
    },
    model_path: {
      type: String,
      required: [true, '3D model path is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    viewer_link: {
      type: String,
      required: [true, 'Viewer link is required'],
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

module.exports = mongoose.model('Product', productSchema);
