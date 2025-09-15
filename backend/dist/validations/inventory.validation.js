"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLocationSchema = exports.createLocationSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const client_1 = require("@prisma/client");
exports.createLocationSchema = joi_1.default.object({
    type: joi_1.default.string().valid(...Object.values(client_1.LocationType)).required(),
    companyId: joi_1.default.number().integer().allow(null),
    branchId: joi_1.default.number().integer().allow(null),
    storageId: joi_1.default.number().integer().allow(null),
});
exports.updateLocationSchema = joi_1.default.object({
    type: joi_1.default.string().valid(...Object.values(client_1.LocationType)),
    companyId: joi_1.default.number().integer().allow(null),
    branchId: joi_1.default.number().integer().allow(null),
    storageId: joi_1.default.number().integer().allow(null),
}).min(1);
