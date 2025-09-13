import Joi from "joi";

export const createStorageSchema = Joi.object({
  name: Joi.string().trim().required(),
  desc: Joi.string().allow(null, ""),
  address: Joi.any(),
  mainPhone: Joi.string().allow(null, ""),
  phones: Joi.array().items(Joi.string()).default([]),
});

export const updateStorageSchema = Joi.object({
  name: Joi.string().trim(),
  desc: Joi.string().allow(null, ""),
  address: Joi.any(),
  mainPhone: Joi.string().allow(null, ""),
  phones: Joi.array().items(Joi.string()),
}).min(1);

