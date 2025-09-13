import Joi from "joi";
import { CompanyType } from "@prisma/client";

export const createCompanySchema = Joi.object({
  name: Joi.string().trim().required(),
  desc: Joi.string().allow(null, ""),
  address: Joi.any(),
  mainPhone: Joi.string().allow(null, ""),
  phones: Joi.array().items(Joi.string()).default([]),
  bannerUrl: Joi.string().uri().allow(null, ""),
  logoUrl: Joi.string().uri().allow(null, ""),
  emails: Joi.array().items(Joi.string().email()).default([]),
  websiteUrl: Joi.string().uri().allow(null, ""),
  type: Joi.string().valid(...Object.values(CompanyType)).required(),
  isActive: Joi.boolean().default(true),
  isBranch: Joi.boolean().default(false),
  companyId: Joi.number().allow(null),
  categoryIds: Joi.array().items(Joi.number().integer()).default([]),
});

export const updateCompanySchema = Joi.object({
  name: Joi.string().trim(),
  desc: Joi.string().allow(null, ""),
  address: Joi.any(),
  mainPhone: Joi.string().allow(null, ""),
  phones: Joi.array().items(Joi.string()),
  bannerUrl: Joi.string().uri().allow(null, ""),
  logoUrl: Joi.string().uri().allow(null, ""),
  emails: Joi.array().items(Joi.string().email()),
  websiteUrl: Joi.string().uri().allow(null, ""),
  type: Joi.string().valid(...Object.values(CompanyType)),
  isActive: Joi.boolean(),
  isBranch: Joi.boolean(),
  companyId: Joi.number().allow(null),
  addCategoryIds: Joi.array().items(Joi.number().integer()),
  removeCategoryIds: Joi.array().items(Joi.number().integer()),
  setCategoryIds: Joi.array().items(Joi.number().integer()),
}).min(1);

