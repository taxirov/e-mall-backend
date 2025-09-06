"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userLoginByEmail = exports.userLoginByNickname = exports.userLoginByPhone = exports.userValidationSchemaRegister = void 0;
const joi_1 = __importDefault(require("joi"));
exports.userValidationSchemaRegister = joi_1.default.object({
    nickname: joi_1.default.string().required(),
    phone: joi_1.default.string().required(),
    password: joi_1.default.string().required()
});
exports.userLoginByPhone = joi_1.default.object({
    phone: joi_1.default.string().required(),
    password: joi_1.default.string().required()
});
exports.userLoginByNickname = joi_1.default.object({
    phone: joi_1.default.string().required(),
    password: joi_1.default.string().required()
});
exports.userLoginByEmail = joi_1.default.object({
    phone: joi_1.default.string().required(),
    password: joi_1.default.string().required()
});
