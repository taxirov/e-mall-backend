"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSubCategorySchema = exports.createSubCategorySchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createSubCategorySchema = joi_1.default.object({
    name: joi_1.default.string().trim().required(),
    description: joi_1.default.string().allow(null, ""),
    categoryId: joi_1.default.number().integer().required(),
});
exports.updateSubCategorySchema = joi_1.default.object({
    name: joi_1.default.string().trim(),
    description: joi_1.default.string().allow(null, ""),
    categoryId: joi_1.default.number().integer(),
}).min(1);
