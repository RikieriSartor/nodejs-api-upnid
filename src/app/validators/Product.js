const Joi = require('joi')

module.exports = {
  body: {
    name: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    imageURL: Joi.string().required(),
    weight: Joi.number().required(),
    height: Joi.number().required(),
    width: Joi.number().required(),
    diameter: Joi.number().required(),
    length: Joi.number().required()
  }
}
