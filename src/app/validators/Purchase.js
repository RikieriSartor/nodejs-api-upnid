const Joi = require('joi')

module.exports = {
  body: {
    product: Joi.string().required(),
    zipcode: Joi.string().required(),
    freight: Joi.number().required(),
    amount: Joi.number().required()
  }
}
