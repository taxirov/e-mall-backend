// src/routes/user.routes.ts
import { Router } from "express";
import { UserController } from "../controllers/user.controller";

const r = Router();
const c = new UserController();

// Users
r.post("/user/register", c.registerViaOtp.bind(c));
r.post('/user/verify-otp', c.verifyOtp.bind(c))
r.post("/user/login", c.login.bind(c));
r.post("/user", c.getAll.bind(c));
r.get("/user/:id", c.getById.bind(c));
r.post("/user/edit", c.edit.bind(c));
r.patch("/user/reset-password", c.updatePassword.bind(c));
// r.patch("/user/:id/image", c.setImage.bind(c));
// r.patch("/user/:id/active", c.setActive.bind(c));

// Finders
r.get("/user/by-phone", c.findByPhone.bind(c));
r.get("/user/by-nickname", c.findByNickname.bind(c));

// Roles
// r.put("/user/:id/roles", c.setRoles.bind(c));

// Telegram
// r.post("/telegram/user", c.createTelegramUser.bind(c));
// r.get("/telegram/user", c.getTelegramUser.bind(c));
// r.post("/telegram/user/:id/deactivate", c.deactiveTelegramUser.bind(c));

export default r;
