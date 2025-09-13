import Joi from "joi";
import { Seasonality } from "@prisma/client";

export const createProductSchema = Joi.object({
  name: Joi.string().trim().required(),
  minAge: Joi.number().integer().min(0).default(0),
  maxAge: Joi.number().integer().min(0).default(100),
  tags: Joi.array().items(Joi.string()).default([]),
  dimensions: Joi.string().allow(null, ""),
  seasonality: Joi.string().valid(...Object.values(Seasonality)).default("ALL_YEAR"),
  categoryId: Joi.number().integer().allow(null),
  subCategoryId: Joi.number().integer().allow(null),
  companyId: Joi.number().integer().allow(null),
});

export const updateProductSchema = Joi.object({
  name: Joi.string().trim(),
  minAge: Joi.number().integer().min(0),
  maxAge: Joi.number().integer().min(0),
  tags: Joi.array().items(Joi.string()),
  dimensions: Joi.string().allow(null, ""),
  seasonality: Joi.string().valid(...Object.values(Seasonality)),
  categoryId: Joi.number().integer().allow(null),
  subCategoryId: Joi.number().integer().allow(null),
  companyId: Joi.number().integer().allow(null),
}).min(1);

