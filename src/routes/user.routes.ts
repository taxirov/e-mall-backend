// src/routes/user.routes.ts
import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { checkToken } from "../middlewares/user.middleware";

const r = Router();
const c = new UserController();

// Users
/**
 * @openapi
 * /api/user/register:
 *   post:
 *     summary: Register user via OTP (creates pending)
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nickname, phone, password]
 *             properties:
 *               nickname: { type: string }
 *               phone: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: OTP sent and pending created or updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string }
 *                 token: { type: string }
 *       409:
 *         description: User already exists or pending duplicate
 */
r.post("/user/register", c.registerViaOtp.bind(c));
/**
 * @openapi
 * /api/user/verify-otp:
 *   post:
 *     summary: Verify OTP and create user
 *     tags: [Users]
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               otp: { type: integer }
 *     responses:
 *       200:
 *         description: User created and logged in
 *       403:
 *         description: Pending code expired or not found
 */
r.post('/user/verify-otp', checkToken, c.verifyOtp.bind(c))
/**
 * @openapi
 * /api/user/login:
 *   post:
 *     summary: Login by nickname + password
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nickname, password]
 *             properties:
 *               nickname: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Successful login
 *       401:
 *         description: Wrong password
 *       404:
 *         description: User not found
 */
r.post("/user/login", c.login.bind(c));
/**
 * @openapi
 * /api/user:
 *   post:
 *     summary: List users with filters (body)
 *     tags: [Users]
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               page: { type: integer }
 *               limit: { type: integer }
 *               search: { type: string }
 *               isActive: { type: boolean }
 *               isLoggedIn: { type: boolean }
 *               rolesAny: { type: array, items: { type: string } }
 *               rolesAll: { type: array, items: { type: string } }
 *               createdFrom: { type: string, format: date-time }
 *               createdTo: { type: string, format: date-time }
 *               salaryMin: { type: integer }
 *               salaryMax: { type: integer }
 *               companyId: { type: integer }
 *               orderBy: { type: string, enum: [createdAt, updatedAt, firstName, lastName, nickname] }
 *               sort: { type: string, enum: [asc, desc] }
 *     responses:
 *       200:
 *         description: Paginated list of users
 */
r.post("/user", checkToken, c.getAll.bind(c));
/**
 * @openapi
 * /api/user/id:
 *   get:
 *     summary: Get user by id (body.id)
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: User
 *       404:
 *         description: Not found
 */
r.get("/user/id", checkToken, c.getById.bind(c));
/**
 * @openapi
 * /api/user/edit:
 *   post:
 *     summary: Edit user profile
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id]
 *             properties:
 *               id: { type: integer }
 *               firstName: { type: string, nullable: true }
 *               lastName: { type: string, nullable: true }
 *               middleName: { type: string, nullable: true }
 *               secondPhone: { type: string, nullable: true }
 *               bio: { type: string, nullable: true }
 *               adress: { type: object, nullable: true }
 *               emails: { type: array, items: { type: string } }
 *               phones: { type: array, items: { type: string } }
 *               salary: { type: integer, nullable: true }
 *     responses:
 *       200:
 *         description: Updated user
 */
r.post("/user/edit", checkToken, c.edit.bind(c));
/**
 * @openapi
 * /api/user/reset-password:
 *   patch:
 *     summary: Update user password
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id, password]
 *             properties:
 *               id: { type: integer }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: OK
 */
r.patch("/user/reset-password", checkToken, c.updatePassword.bind(c));
// r.patch("/user/:id/image", c.setImage.bind(c));
// r.patch("/user/:id/active", c.setActive.bind(c));

// Finders
/**
 * @openapi
 * /api/user/phone:
 *   post:
 *     summary: Find user by phone
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [phone]
 *             properties:
 *               phone: { type: string }
 */
r.post("/user/phone", checkToken, c.findByPhone.bind(c));
/**
 * @openapi
 * /api/user/nickname:
 *   post:
 *     summary: Find user by nickname
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nickname]
 *             properties:
 *               nickname: { type: string }
 */
r.post("/user/nickname", checkToken, c.findByNickname.bind(c));
/**
 * @openapi
 * /api/user/nickname-check:
 *   post:
 *     summary: Check if nickname is taken
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nickname]
 *             properties:
 *               nickname: { type: string }
 */
r.post("/user/nickname-check", c.checkNicknameCreated.bind(c));
/**
 * @openapi
 * /api/user/phone-check:
 *   post:
 *     summary: Check if phone is taken
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [phone]
 *             properties:
 *               phone: { type: string }
 */
r.post("/user/phone-check", c.checkPhoneCreated.bind(c));

// Roles
// r.put("/user/:id/roles", c.setRoles.bind(c));

// Telegram
// r.post("/telegram/user", c.createTelegramUser.bind(c));
// r.get("/telegram/user", c.getTelegramUser.bind(c));
// r.post("/telegram/user/:id/deactivate", c.deactiveTelegramUser.bind(c));

export default r;
