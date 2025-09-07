// src/routes/user.routes.ts
import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { checkToken } from "../middlewares/user.middleware";

const r = Router();
const c = new UserController();

// Users
r.post("/user/register", c.registerViaOtp.bind(c));
r.post('/user/verify-otp', checkToken, c.verifyOtp.bind(c))
r.post("/user/login", c.login.bind(c));
r.post("/user", checkToken, c.getAll.bind(c));
r.get("/user/id", checkToken, c.getById.bind(c));
r.post("/user/edit", checkToken, c.edit.bind(c));
r.patch("/user/reset-password", checkToken, c.updatePassword.bind(c));
// r.patch("/user/:id/image", c.setImage.bind(c));
// r.patch("/user/:id/active", c.setActive.bind(c));

// Finders
r.get("/user/phone", checkToken, c.findByPhone.bind(c));
r.get("/user/nickname", checkToken, c.findByNickname.bind(c));
r.get("/user/nickname-check", c.checkNicknameCreated.bind(c));
r.get("/user/phone-check", c.checkPhoneCreated.bind(c));

// Roles
// r.put("/user/:id/roles", c.setRoles.bind(c));

// Telegram
// r.post("/telegram/user", c.createTelegramUser.bind(c));
// r.get("/telegram/user", c.getTelegramUser.bind(c));
// r.post("/telegram/user/:id/deactivate", c.deactiveTelegramUser.bind(c));

export default r;
