import { Router } from "express";
import { TransferController } from "../controllers/transfer.controller";
import { checkToken } from "../middlewares/user.middleware";
import { validateBody } from "../middlewares/validate";
import Joi from "joi";
import { TransferStatus } from "@prisma/client";

const r = Router();
const c = new TransferController();

const createTransferSchema = Joi.object({
  fromLocationId: Joi.number().integer().required(),
  toLocationId: Joi.number().integer().required(),
  note: Joi.string().allow(null, ""),
  status: Joi.string().valid(...Object.values(TransferStatus)).default("DRAFT"),
  items: Joi.array().items(Joi.object({ productId: Joi.number().integer().required(), quantity: Joi.number().integer().min(1).required() })).default([]),
});
const setStatusSchema = Joi.object({ status: Joi.string().valid(...Object.values(TransferStatus)).required() });
const addItemSchema = Joi.object({ productId: Joi.number().integer().required(), quantity: Joi.number().integer().min(1).required() });

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
r.post("/transfer", checkToken, validateBody(createTransferSchema), c.create.bind(c));
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
r.get("/transfer/:id", checkToken, c.getById.bind(c));
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
r.get("/transfers", checkToken, c.list.bind(c));
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
r.patch("/transfer/:id/status", checkToken, validateBody(setStatusSchema), c.setStatus.bind(c));
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
r.post("/transfer/:id/item", checkToken, validateBody(addItemSchema), c.addItem.bind(c));
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
r.delete("/transfer/:id/item/:productId", checkToken, c.removeItem.bind(c));

export default r;
