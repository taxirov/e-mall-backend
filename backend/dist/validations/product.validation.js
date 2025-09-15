"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductSchema = exports.createProductSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const client_1 = require("@prisma/client");
exports.createProductSchema = joi_1.default.object({
    name: joi_1.default.string().trim().required(),
    minAge: joi_1.default.number().integer().min(0).default(0),
    maxAge: joi_1.default.number().integer().min(0).default(100),
    tags: joi_1.default.array().items(joi_1.default.string()).default([]),
    dimensions: joi_1.default.string().allow(null, ""),
    seasonality: joi_1.default.string().valid(...Object.values(client_1.Seasonality)).default("ALL_YEAR"),
    categoryId: joi_1.default.number().integer().allow(null),
    subCategoryId: joi_1.default.number().integer().allow(null),
    companyId: joi_1.default.number().integer().allow(null),
});
exports.updateProductSchema = joi_1.default.object({
    name: joi_1.default.string().trim(),
    minAge: joi_1.default.number().integer().min(0),
    maxAge: joi_1.default.number().integer().min(0),
    tags: joi_1.default.array().items(joi_1.default.string()),
    dimensions: joi_1.default.string().allow(null, ""),
    seasonality: joi_1.default.string().valid(...Object.values(client_1.Seasonality)),
    categoryId: joi_1.default.number().integer().allow(null),
    subCategoryId: joi_1.default.number().integer().allow(null),
    companyId: joi_1.default.number().integer().allow(null),
}).min(1);
