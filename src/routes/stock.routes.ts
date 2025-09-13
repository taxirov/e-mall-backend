import { Router } from "express";
import { StockController } from "../controllers/stock.controller";
import { checkToken } from "../middlewares/user.middleware";
import { validateBody } from "../middlewares/validate";
import { upsertStockSchema, updateStockSchema } from "../validations/stock.validation";

const r = Router();
const c = new StockController();

/**
 * @openapi
 * /api/stock:
 *   post:
 *     summary: Upsert stock for location and product
 *     tags: [Stocks]
 */
r.post("/stock", checkToken, validateBody(upsertStockSchema), c.upsert.bind(c));
/**
 * @openapi
 * /api/stock:
 *   get:
 *     summary: Get stock by locationId and productId (query)
 *     tags: [Stocks]
 *     parameters:
 *       - in: query
 *         name: locationId
 *         schema: { type: integer }
 *       - in: query
 *         name: productId
 *         schema: { type: integer }
 *     responses:
 *       200: { description: OK }
 */
r.get("/stock", checkToken, c.get.bind(c));
/**
 * @openapi
 * /api/stocks:
 *   get:
 *     summary: List stocks
 *     tags: [Stocks]
 *     parameters:
 *       - in: query
 *         name: locationId
 *         schema: { type: integer }
 *       - in: query
 *         name: productId
 *         schema: { type: integer }
 *     responses:
 *       200: { description: OK }
 */
r.get("/stocks", checkToken, c.list.bind(c));
/**
 * @openapi
 * /api/stock/{locationId}/{productId}:
 *   patch:
 *     summary: Update stock
 *     tags: [Stocks]
 *     parameters:
 *       - in: path
 *         name: locationId
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: productId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity: { type: integer }
 */
r.patch("/stock/:locationId/:productId", checkToken, validateBody(updateStockSchema), c.update.bind(c));
/**
 * @openapi
 * /api/stock/{locationId}/{productId}:
 *   delete:
 *     summary: Delete stock entry
 *     tags: [Stocks]
 *     parameters:
 *       - in: path
 *         name: locationId
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: productId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: OK }
 */
r.delete("/stock/:locationId/:productId", checkToken, c.delete.bind(c));

export default r;
