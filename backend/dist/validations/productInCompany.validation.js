"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductInCompanySchema = exports.createProductInCompanySchema = void 0;
const joi_1 = __importDefault(require("joi"));
const client_1 = require("@prisma/client");
exports.createProductInCompanySchema = joi_1.default.object({
    productId: joi_1.default.number().integer().required(),
    companyId: joi_1.default.number().integer().required(),
    categoryId: joi_1.default.number().integer().allow(null),
    subCategoryId: joi_1.default.number().integer().allow(null),
    barcode: joi_1.default.string().allow(null, ""),
    description: joi_1.default.string().allow(null, ""),
    price: joi_1.default.number().min(0).default(0),
    discountPrice: joi_1.default.number().min(0).allow(null),
    stock: joi_1.default.number().integer().min(0).default(0),
    lowStock: joi_1.default.number().integer().min(0).default(3),
    isFeatured: joi_1.default.boolean().default(false),
    minAge: joi_1.default.number().integer().min(0).default(0),
    maxAge: joi_1.default.number().integer().min(0).default(100),
    images: joi_1.default.array().items(joi_1.default.string()).default([]),
    weight: joi_1.default.number().allow(null),
    viewCount: joi_1.default.number().integer().min(0).default(0),
    publishedAt: joi_1.default.date().allow(null),
    status: joi_1.default.string().valid(...Object.values(client_1.ProductStatus)).default("ACTIVE"),
    unit: joi_1.default.string().valid(...Object.values(client_1.Unit)).default("PIECE"),
    currency: joi_1.default.string().valid(...Object.values(client_1.Currency)).default("UZS"),
});
exports.updateProductInCompanySchema = joi_1.default.object({
    productId: joi_1.default.number().integer(),
    companyId: joi_1.default.number().integer(),
    categoryId: joi_1.default.number().integer().allow(null),
    subCategoryId: joi_1.default.number().integer().allow(null),
    barcode: joi_1.default.string().allow(null, ""),
    description: joi_1.default.string().allow(null, ""),
    price: joi_1.default.number().min(0),
    discountPrice: joi_1.default.number().min(0).allow(null),
    stock: joi_1.default.number().integer().min(0),
    lowStock: joi_1.default.number().integer().min(0),
    isFeatured: joi_1.default.boolean(),
    minAge: joi_1.default.number().integer().min(0),
    maxAge: joi_1.default.number().integer().min(0),
    images: joi_1.default.array().items(joi_1.default.string()),
    weight: joi_1.default.number().allow(null),
    viewCount: joi_1.default.number().integer().min(0),
    publishedAt: joi_1.default.date().allow(null),
    status: joi_1.default.string().valid(...Object.values(client_1.ProductStatus)),
    unit: joi_1.default.string().valid(...Object.values(client_1.Unit)),
    currency: joi_1.default.string().valid(...Object.values(client_1.Currency)),
}).min(1);
