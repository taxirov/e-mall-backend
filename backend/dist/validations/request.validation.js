"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRequestSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const client_1 = require("@prisma/client");
exports.createRequestSchema = joi_1.default.object({
    requesterId: joi_1.default.number().integer().required(),
    companyId: joi_1.default.number().integer().required(),
    targetUserId: joi_1.default.number().integer(),
    targetNicknameOrPhone: joi_1.default.string(),
    roles: joi_1.default.array().items(joi_1.default.string().valid(...Object.values(client_1.Role))).min(1).required(),
    salary: joi_1.default.number().integer().min(0).allow(null),
    message: joi_1.default.string().allow(null, ""),
}).xor("targetUserId", "targetNicknameOrPhone");
