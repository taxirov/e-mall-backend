import Joi from "joi";

export const createBranchSchema = Joi.object({
  name: Joi.string().trim().required(),
  desc: Joi.string().allow(null, ""),
  address: Joi.any(),
  mainPhone: Joi.string().allow(null, ""),
  phones: Joi.array().items(Joi.string()).default([]),
  companyId: Joi.number().integer().required(),
});

export const updateBranchSchema = Joi.object({
  name: Joi.string().trim(),
  desc: Joi.string().allow(null, ""),
  address: Joi.any(),
  mainPhone: Joi.string().allow(null, ""),
  phones: Joi.array().items(Joi.string()),
  companyId: Joi.number().integer(),
}).min(1);

