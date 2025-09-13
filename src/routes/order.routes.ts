import { Router } from "express";
import { OrderController } from "../controllers/order.controller";
import { checkToken } from "../middlewares/user.middleware";
import { validateBody } from "../middlewares/validate";
import Joi from "joi";
import { OrderStatus, Role } from "@prisma/client";

const r = Router();
const c = new OrderController();

const createOrderSchema = Joi.object({
  status: Joi.string().valid(...Object.values(OrderStatus)).default("PENDING"),
  items: Joi.array().items(
    Joi.object({
      productId: Joi.number().integer().required(),
      quantity: Joi.number().integer().min(1).default(1),
      price: Joi.number().min(0).required(),
      productInCompanyId: Joi.number().integer().allow(null),
    })
  ).default([]),
});

const setStatusSchema = Joi.object({ status: Joi.string().valid(...Object.values(OrderStatus)).required() });
const addItemSchema = Joi.object({ productId: Joi.number().integer().required(), quantity: Joi.number().integer().min(1).default(1), price: Joi.number().min(0).required(), productInCompanyId: Joi.number().integer().allow(null) });
const assignSchema = Joi.object({ userId: Joi.number().integer().required(), role: Joi.string().valid(...Object.values(Role)).required() });

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
r.post("/order", checkToken, validateBody(createOrderSchema), c.create.bind(c));
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
r.get("/order/:id", checkToken, c.getById.bind(c));
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
r.get("/orders", checkToken, c.list.bind(c));
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
r.patch("/order/:id/status", checkToken, validateBody(setStatusSchema), c.setStatus.bind(c));
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
r.post("/order/:id/item", checkToken, validateBody(addItemSchema), c.addItem.bind(c));
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
r.delete("/order/:id/item/:productId", checkToken, c.removeItem.bind(c));
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
r.post("/order/:id/assign", checkToken, validateBody(assignSchema), c.assign.bind(c));
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
r.delete("/order/:id/assign/:userId/:role", checkToken, c.unassign.bind(c));

export default r;
