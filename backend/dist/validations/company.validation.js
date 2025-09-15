"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCompanySchema = exports.createCompanySchema = void 0;
const joi_1 = __importDefault(require("joi"));
const client_1 = require("@prisma/client");
exports.createCompanySchema = joi_1.default.object({
    name: joi_1.default.string().trim().required(),
    desc: joi_1.default.string().allow(null, ""),
    address: joi_1.default.any(),
    mainPhone: joi_1.default.string().allow(null, ""),
    phones: joi_1.default.array().items(joi_1.default.string()).default([]),
    bannerUrl: joi_1.default.string().uri().allow(null, ""),
    logoUrl: joi_1.default.string().uri().allow(null, ""),
    emails: joi_1.default.array().items(joi_1.default.string().email()).default([]),
    websiteUrl: joi_1.default.string().uri().allow(null, ""),
    type: joi_1.default.string().valid(...Object.values(client_1.CompanyType)).required(),
    isActive: joi_1.default.boolean().default(true),
    isBranch: joi_1.default.boolean().default(false),
    companyId: joi_1.default.number().allow(null),
    categoryIds: joi_1.default.array().items(joi_1.default.number().integer()).default([]),
});
exports.updateCompanySchema = joi_1.default.object({
    name: joi_1.default.string().trim(),
    desc: joi_1.default.string().allow(null, ""),
    address: joi_1.default.any(),
    mainPhone: joi_1.default.string().allow(null, ""),
    phones: joi_1.default.array().items(joi_1.default.string()),
    bannerUrl: joi_1.default.string().uri().allow(null, ""),
    logoUrl: joi_1.default.string().uri().allow(null, ""),
    emails: joi_1.default.array().items(joi_1.default.string().email()),
    websiteUrl: joi_1.default.string().uri().allow(null, ""),
    type: joi_1.default.string().valid(...Object.values(client_1.CompanyType)),
    isActive: joi_1.default.boolean(),
    isBranch: joi_1.default.boolean(),
    companyId: joi_1.default.number().allow(null),
    addCategoryIds: joi_1.default.array().items(joi_1.default.number().integer()),
    removeCategoryIds: joi_1.default.array().items(joi_1.default.number().integer()),
    setCategoryIds: joi_1.default.array().items(joi_1.default.number().integer()),
}).min(1);
