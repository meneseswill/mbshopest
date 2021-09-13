const fs = require('fs')

const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Ingrese el usuario'],
  },
  name: {
    type: String,
    required: [true, 'Ingrese el nombre del producto'],
    unique: [true, 'El nombre del producto ya existe'],
    trim: true,
    maxlength: [50, 'El nombre del producto no debe exceder de 50 caracteres'],
  },
  image: {
    type: String,
    default: '/uploads/no-image.jpg',
  },
  brand: {
    type: String,
    required: [true, 'Ingrese la marca del producto'],
  },
  category: {
    type: String,
    required: [true, 'Ingrese lac categoría del producto'],
  },
  description: {
    type: String,
    required: [true, 'Por favor ingrese la descripción del producto'],
    maxlength: [500, 'La descripción no puede acceder de 500 caracteres'],
  },
  rating: {
    type: Number,
    default: 0,
  },
  reviews: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    default: 0,
  },
  countInStock: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

ProductSchema.pre('remove', async function (next) {
  try {
    fs.unlinkSync(this.image)
  } catch (err) {
    console.log(err)
  }
})

module.exports = mongoose.model('Product', ProductSchema)
