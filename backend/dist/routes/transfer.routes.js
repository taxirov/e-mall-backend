"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const transfer_controller_1 = require("../controllers/transfer.controller");
const user_middleware_1 = require("../middlewares/user.middleware");
const validate_1 = require("../middlewares/validate");
const joi_1 = __importDefault(require("joi"));
const client_1 = require("@prisma/client");
const r = (0, express_1.Router)();
const c = new transfer_controller_1.TransferController();
const createTransferSchema = joi_1.default.object({
    fromLocationId: joi_1.default.number().integer().required(),
    toLocationId: joi_1.default.number().integer().required(),
    note: joi_1.default.string().allow(null, ""),
    status: joi_1.default.string().valid(...Object.values(client_1.TransferStatus)).default("DRAFT"),
    items: joi_1.default.array().items(joi_1.default.object({ productId: joi_1.default.number().integer().required(), quantity: joi_1.default.number().integer().min(1).required() })).default([]),
});
const setStatusSchema = joi_1.default.object({ status: joi_1.default.string().valid(...Object.values(client_1.TransferStatus)).required() });
const addItemSchema = joi_1.default.object({ productId: joi_1.default.number().integer().required(), quantity: joi_1.default.number().integer().min(1).required() });
/**
 * @openapi
 * /api/transfer:
 *   post:
 *     summary: Create transfer
 *     tags: [Transfers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [fromLocationId, toLocationId, items]
 *             properties:
 *               fromLocationId: { type: integer }
 *               toLocationId: { type: integer }
 *               note: { type: string }
 *               status: { type: string }
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [productId, quantity]
 *                   properties:
 *                     productId: { type: integer }
 *                     quantity: { type: integer }
 *     responses:
 *       201: { description: Created }
 */
r.post("/transfer", user_middleware_1.checkToken, (0, validate_1.validateBody)(createTransferSchema), c.create.bind(c));
/**
 * @openapi
 * /api/transfer/{id}:
 *   get:
 *     summary: Get transfer by id
 *     tags: [Transfers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: OK }
 *       404: { description: Not found }
 */
r.get("/transfer/:id", user_middleware_1.checkToken, c.getById.bind(c));
/**
 * @openapi
 * /api/transfers:
 *   get:
 *     summary: List transfers
 *     tags: [Transfers]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string }
 *       - in: query
 *         name: fromLocationId
 *         schema: { type: integer }
 *       - in: query
 *         name: toLocationId
 *         schema: { type: integer }
 *     responses:
 *       200: { description: OK }
 */
r.get("/transfers", user_middleware_1.checkToken, c.list.bind(c));
/**
 * @openapi
 * /api/transfer/{id}/status:
 *   patch:
 *     summary: Update transfer status
 *     tags: [Transfers]
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
r.patch("/transfer/:id/status", user_middleware_1.checkToken, (0, validate_1.validateBody)(setStatusSchema), c.setStatus.bind(c));
/**
 * @openapi
 * /api/transfer/{id}/item:
 *   post:
 *     summary: Add transfer item
 *     tags: [Transfers]
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
 *             required: [productId, quantity]
 *             properties:
 *               productId: { type: integer }
 *               quantity: { type: integer }
 *     responses:
 *       201: { description: Created }
 */
r.post("/transfer/:id/item", user_middleware_1.checkToken, (0, validate_1.validateBody)(addItemSchema), c.addItem.bind(c));
/**
 * @openapi
 * /api/transfer/{id}/item/{productId}:
 *   delete:
 *     summary: Remove transfer item
 *     tags: [Transfers]
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
r.delete("/transfer/:id/item/:productId", user_middleware_1.checkToken, c.removeItem.bind(c));
exports.default = r;
