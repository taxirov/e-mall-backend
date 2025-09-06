"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const express_joi_validation_1 = require("express-joi-validation");
const user_validation_1 = require("../validations/user.validation");
const user_middleware_1 = require("../middlewares/user.middleware");
const router = express_1.default.Router();
const validator = (0, express_joi_validation_1.createValidator)();
const userController = new user_controller_1.UserController();
router.post('/register', validator.body(user_validation_1.userValidationSchemaRegister), userController.registerViaOtp);
router.post('/verify-otp', user_middleware_1.checkToken, userController.verifyOtp);
// router.post('/login/via-telegram', userController.telegramVerify)
router.post('/login', userController.login);
exports.default = router;
