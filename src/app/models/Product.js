const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')

const Product = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  imageURL: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    default: 'A'
  },
  weight: {
    type: Number,
    required: true
  },
  height: {
    type: Number,
    required: true
  },
  width: {
    type: Number,
    required: true
  },
  diameter: {
    type: Number,
    required: true
  },
  length: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

Product.plugin(mongoosePaginate)

module.exports = mongoose.model('Product', Product)
