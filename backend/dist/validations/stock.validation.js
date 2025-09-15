"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStockSchema = exports.upsertStockSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.upsertStockSchema = joi_1.default.object({
    locationId: joi_1.default.number().integer().required(),
    productId: joi_1.default.number().integer().required(),
    quantity: joi_1.default.number().integer().min(0).default(0),
});
exports.updateStockSchema = joi_1.default.object({
    locationId: joi_1.default.number().integer(),
    productId: joi_1.default.number().integer(),
    quantity: joi_1.default.number().integer().min(0),
}).min(1);
