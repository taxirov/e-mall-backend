import Joi from "joi";

export const createCategorySchema = Joi.object({
  name: Joi.string().trim().required(),
  description: Joi.string().allow(null, ""),
});

export const updateCategorySchema = Joi.object({
  name: Joi.string().trim(),
  description: Joi.string().allow(null, ""),
}).min(1);

