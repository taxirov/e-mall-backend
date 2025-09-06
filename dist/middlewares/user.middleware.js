"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkToken = checkToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
async function checkToken(req, res, next) {
    try {
        const token = req.header('authorization');
        if (!token) {
            res.status(403).json({
                message: "Token not provided"
            });
        }
        else {
            const payload = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY);
            res.locals.payload = payload;
            next();
        }
    }
    catch (error) {
        res.json({
            message: error.message
        });
    }
}
