"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBranchSchema = exports.createBranchSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createBranchSchema = joi_1.default.object({
    name: joi_1.default.string().trim().required(),
    desc: joi_1.default.string().allow(null, ""),
    address: joi_1.default.any(),
    mainPhone: joi_1.default.string().allow(null, ""),
    phones: joi_1.default.array().items(joi_1.default.string()).default([]),
    companyId: joi_1.default.number().integer().required(),
});
exports.updateBranchSchema = joi_1.default.object({
    name: joi_1.default.string().trim(),
    desc: joi_1.default.string().allow(null, ""),
    address: joi_1.default.any(),
    mainPhone: joi_1.default.string().allow(null, ""),
    phones: joi_1.default.array().items(joi_1.default.string()),
    companyId: joi_1.default.number().integer(),
}).min(1);
