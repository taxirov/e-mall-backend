"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCategorySchema = exports.createCategorySchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createCategorySchema = joi_1.default.object({
    name: joi_1.default.string().trim().required(),
    description: joi_1.default.string().allow(null, ""),
});
exports.updateCategorySchema = joi_1.default.object({
    name: joi_1.default.string().trim(),
    description: joi_1.default.string().allow(null, ""),
}).min(1);
