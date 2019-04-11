const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')

const Payment = new mongoose.Schema({
  purchase: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Purchase',
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

Payment.plugin(mongoosePaginate)

module.exports = mongoose.model('Payment', Payment)
