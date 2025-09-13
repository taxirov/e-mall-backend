import Joi from "joi";

export const upsertStockSchema = Joi.object({
  locationId: Joi.number().integer().required(),
  productId: Joi.number().integer().required(),
  quantity: Joi.number().integer().min(0).default(0),
});

export const updateStockSchema = Joi.object({
  locationId: Joi.number().integer(),
  productId: Joi.number().integer(),
  quantity: Joi.number().integer().min(0),
}).min(1);

