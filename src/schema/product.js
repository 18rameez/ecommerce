const Joi = require('joi');

const productSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  stock: Joi.number().min(0).required(),
  category: Joi.string().required(),
  brand: Joi.string().required(),
  price: Joi.array().items(
    Joi.object({
      size: Joi.string().required(),
      value: Joi.number().min(0).required()
    })
  ).required(),
  color: Joi.string().required(),
  available_area: Joi.array().items(Joi.number()).required()
});

module.exports = productSchema;