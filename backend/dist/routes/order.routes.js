"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const order_controller_1 = require("../controllers/order.controller");
const user_middleware_1 = require("../middlewares/user.middleware");
const validate_1 = require("../middlewares/validate");
const joi_1 = __importDefault(require("joi"));
const client_1 = require("@prisma/client");
const r = (0, express_1.Router)();
const c = new order_controller_1.OrderController();
const createOrderSchema = joi_1.default.object({
    status: joi_1.default.string().valid(...Object.values(client_1.OrderStatus)).default("PENDING"),
    items: joi_1.default.array().items(joi_1.default.object({
        productId: joi_1.default.number().integer().required(),
        quantity: joi_1.default.number().integer().min(1).default(1),
        price: joi_1.default.number().min(0).required(),
        productInCompanyId: joi_1.default.number().integer().allow(null),
    })).default([]),
});
const setStatusSchema = joi_1.default.object({ status: joi_1.default.string().valid(...Object.values(client_1.OrderStatus)).required() });
const addItemSchema = joi_1.default.object({ productId: joi_1.default.number().integer().required(), quantity: joi_1.default.number().integer().min(1).default(1), price: joi_1.default.number().min(0).required(), productInCompanyId: joi_1.default.number().integer().allow(null) });
const assignSchema = joi_1.default.object({ userId: joi_1.default.number().integer().required(), role: joi_1.default.string().valid(...Object.values(client_1.Role)).required() });
/**
 * @openapi
 * /api/order:
 *   post:
 *     summary: Create order
 *     tags: [Orders]
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status: { type: string }
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId: { type: integer }
 *                     quantity: { type: integer }
 *                     price: { type: number }
 *                     productInCompanyId: { type: integer, nullable: true }
 *     responses:
 *       201: { description: Created }
 */
r.post("/order", user_middleware_1.checkToken, (0, validate_1.validateBody)(createOrderSchema), c.create.bind(c));
/**
 * @openapi
 * /api/order/{id}:
 *   get:
 *     summary: Get order by id
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: OK }
 *       404: { description: Not found }
 */
r.get("/order/:id", user_middleware_1.checkToken, c.getById.bind(c));
/**
 * @openapi
 * /api/orders:
 *   get:
 *     summary: List orders
 *     tags: [Orders]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string }
 *     responses:
 *       200: { description: OK }
 */
r.get("/orders", user_middleware_1.checkToken, c.list.bind(c));
/**
 * @openapi
 * /api/order/{id}/status:
 *   patch:
 *     summary: Update order status
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status: { type: string }
 *     responses:
 *       200: { description: OK }
 */
r.patch("/order/:id/status", user_middleware_1.checkToken, (0, validate_1.validateBody)(setStatusSchema), c.setStatus.bind(c));
/**
 * @openapi
 * /api/order/{id}/item:
 *   post:
 *     summary: Add order item
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [productId, price]
 *             properties:
 *               productId: { type: integer }
 *               quantity: { type: integer }
 *               price: { type: number }
 *               productInCompanyId: { type: integer, nullable: true }
 *     responses:
 *       201: { description: Created }
 */
r.post("/order/:id/item", user_middleware_1.checkToken, (0, validate_1.validateBody)(addItemSchema), c.addItem.bind(c));
/**
 * @openapi
 * /api/order/{id}/item/{productId}:
 *   delete:
 *     summary: Remove order item
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: productId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: OK }
 */
r.delete("/order/:id/item/:productId", user_middleware_1.checkToken, c.removeItem.bind(c));
/**
 * @openapi
 * /api/order/{id}/assign:
 *   post:
 *     summary: Assign user to order
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, role]
 *             properties:
 *               userId: { type: integer }
 *               role: { type: string }
 *     responses:
 *       201: { description: Created }
 */
r.post("/order/:id/assign", user_middleware_1.checkToken, (0, validate_1.validateBody)(assignSchema), c.assign.bind(c));
/**
 * @openapi
 * /api/order/{id}/assign/{userId}/{role}:
 *   delete:
 *     summary: Unassign user from order
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: role
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: OK }
 */
r.delete("/order/:id/assign/:userId/:role", user_middleware_1.checkToken, c.unassign.bind(c));
exports.default = r;
