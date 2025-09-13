import Joi from "joi";

export const createSubCategorySchema = Joi.object({
  name: Joi.string().trim().required(),
  description: Joi.string().allow(null, ""),
  categoryId: Joi.number().integer().required(),
});

export const updateSubCategorySchema = Joi.object({
  name: Joi.string().trim(),
  description: Joi.string().allow(null, ""),
  categoryId: Joi.number().integer(),
}).min(1);

