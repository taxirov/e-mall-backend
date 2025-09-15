"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const stock_controller_1 = require("../controllers/stock.controller");
const user_middleware_1 = require("../middlewares/user.middleware");
const validate_1 = require("../middlewares/validate");
const stock_validation_1 = require("../validations/stock.validation");
const r = (0, express_1.Router)();
const c = new stock_controller_1.StockController();
/**
 * @openapi
 * /api/stock:
 *   post:
 *     summary: Upsert stock for location and product
 *     tags: [Stocks]
 */
r.post("/stock", user_middleware_1.checkToken, (0, validate_1.validateBody)(stock_validation_1.upsertStockSchema), c.upsert.bind(c));
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
r.get("/stock", user_middleware_1.checkToken, c.get.bind(c));
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
r.get("/stocks", user_middleware_1.checkToken, c.list.bind(c));
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
r.patch("/stock/:locationId/:productId", user_middleware_1.checkToken, (0, validate_1.validateBody)(stock_validation_1.updateStockSchema), c.update.bind(c));
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
r.delete("/stock/:locationId/:productId", user_middleware_1.checkToken, c.delete.bind(c));
exports.default = r;
