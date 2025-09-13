import Joi from "joi";
import { Currency, ProductStatus, Unit } from "@prisma/client";

export const createProductInCompanySchema = Joi.object({
  productId: Joi.number().integer().required(),
  companyId: Joi.number().integer().required(),
  categoryId: Joi.number().integer().allow(null),
  subCategoryId: Joi.number().integer().allow(null),
  barcode: Joi.string().allow(null, ""),
  description: Joi.string().allow(null, ""),
  price: Joi.number().min(0).default(0),
  discountPrice: Joi.number().min(0).allow(null),
  stock: Joi.number().integer().min(0).default(0),
  lowStock: Joi.number().integer().min(0).default(3),
  isFeatured: Joi.boolean().default(false),
  minAge: Joi.number().integer().min(0).default(0),
  maxAge: Joi.number().integer().min(0).default(100),
  images: Joi.array().items(Joi.string()).default([]),
  weight: Joi.number().allow(null),
  viewCount: Joi.number().integer().min(0).default(0),
  publishedAt: Joi.date().allow(null),
  status: Joi.string().valid(...Object.values(ProductStatus)).default("ACTIVE"),
  unit: Joi.string().valid(...Object.values(Unit)).default("PIECE"),
  currency: Joi.string().valid(...Object.values(Currency)).default("UZS"),
});

export const updateProductInCompanySchema = Joi.object({
  productId: Joi.number().integer(),
  companyId: Joi.number().integer(),
  categoryId: Joi.number().integer().allow(null),
  subCategoryId: Joi.number().integer().allow(null),
  barcode: Joi.string().allow(null, ""),
  description: Joi.string().allow(null, ""),
  price: Joi.number().min(0),
  discountPrice: Joi.number().min(0).allow(null),
  stock: Joi.number().integer().min(0),
  lowStock: Joi.number().integer().min(0),
  isFeatured: Joi.boolean(),
  minAge: Joi.number().integer().min(0),
  maxAge: Joi.number().integer().min(0),
  images: Joi.array().items(Joi.string()),
  weight: Joi.number().allow(null),
  viewCount: Joi.number().integer().min(0),
  publishedAt: Joi.date().allow(null),
  status: Joi.string().valid(...Object.values(ProductStatus)),
  unit: Joi.string().valid(...Object.values(Unit)),
  currency: Joi.string().valid(...Object.values(Currency)),
}).min(1);

