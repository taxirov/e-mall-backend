"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = require("../controllers/product.controller");
const user_middleware_1 = require("../middlewares/user.middleware");
const validate_1 = require("../middlewares/validate");
const product_validation_1 = require("../validations/product.validation");
const r = (0, express_1.Router)();
const c = new product_controller_1.ProductController();
/**
 * @openapi
 * /api/product:
 *   post:
 *     summary: Create product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name: { type: string }
 *               minAge: { type: integer }
 *               maxAge: { type: integer }
 *               tags: { type: array, items: { type: string } }
 *               dimensions: { type: string }
 *               seasonality: { type: string }
 *               categoryId: { type: integer, nullable: true }
 *               subCategoryId: { type: integer, nullable: true }
 *               companyId: { type: integer, nullable: true }
 */
r.post("/product", user_middleware_1.checkToken, (0, validate_1.validateBody)(product_validation_1.createProductSchema), c.create.bind(c));
/**
 * @openapi
 * /api/product/{id}:
 *   get:
 *     summary: Get product by id
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: OK }
 *       404: { description: Not found }
 */
r.get("/product/:id", user_middleware_1.checkToken, c.getById.bind(c));
/**
 * @openapi
 * /api/products:
 *   get:
 *     summary: List products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *       - in: query
 *         name: categoryId
 *         schema: { type: integer }
 *       - in: query
 *         name: subCategoryId
 *         schema: { type: integer }
 *       - in: query
 *         name: companyId
 *         schema: { type: integer }
 *     responses:
 *       200: { description: OK }
 */
r.get("/products", user_middleware_1.checkToken, c.list.bind(c));
/**
 * @openapi
 * /api/product/{id}:
 *   patch:
 *     summary: Update product
 *     tags: [Products]
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
 *             properties:
 *               name: { type: string }
 *               minAge: { type: integer }
 *               maxAge: { type: integer }
 *               tags: { type: array, items: { type: string } }
 *               dimensions: { type: string }
 *               seasonality: { type: string }
 *               categoryId: { type: integer, nullable: true }
 *               subCategoryId: { type: integer, nullable: true }
 *               companyId: { type: integer, nullable: true }
 */
r.patch("/product/:id", user_middleware_1.checkToken, (0, validate_1.validateBody)(product_validation_1.updateProductSchema), c.update.bind(c));
/**
 * @openapi
 * /api/product/{id}:
 *   delete:
 *     summary: Delete product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: OK }
 */
r.delete("/product/:id", user_middleware_1.checkToken, c.delete.bind(c));
exports.default = r;
