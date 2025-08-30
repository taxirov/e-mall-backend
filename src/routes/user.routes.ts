import express from 'express';
import { UserController } from "../controllers/user.controller";
import { createValidator } from 'express-joi-validation';
import { userValidationSchemaRegister } from '../validations/user.validation';
import { checkToken } from '../middlewares/user.middleware';

const router = express.Router();
const validator = createValidator();
const userController = new UserController()

router.post('/register',   validator.body(userValidationSchemaRegister), userController.register)
router.post('/register/telegram', userController.telegramVerify)
router.post('/login',   userController.login)

export default router;
