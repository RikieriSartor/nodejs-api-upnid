const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')

const Purchase = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  zipcode: {
    type: String,
    required: true
  },
  freight: {
    type: Number,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  token: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    default: 'P'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

Purchase.plugin(mongoosePaginate)

module.exports = mongoose.model('Purchase', Purchase)
