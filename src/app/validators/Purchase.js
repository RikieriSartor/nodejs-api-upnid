const Joi = require('joi')

module.exports = {
  body: {
    products: Joi.array().items(),
    zipcode: Joi.string().required(),
    freight: Joi.number().required(),
    amount: Joi.number().required()
  }
}
