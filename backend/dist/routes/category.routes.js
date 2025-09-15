"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const category_controller_1 = require("../controllers/category.controller");
const user_middleware_1 = require("../middlewares/user.middleware");
const validate_1 = require("../middlewares/validate");
const category_validation_1 = require("../validations/category.validation");
const r = (0, express_1.Router)();
const c = new category_controller_1.CategoryController();
/**
 * @openapi
 * /api/category:
 *   post:
 *     summary: Create category
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 */
r.post("/category", user_middleware_1.checkToken, (0, validate_1.validateBody)(category_validation_1.createCategorySchema), c.create.bind(c));
/**
 * @openapi
 * /api/category/{id}:
 *   get:
 *     summary: Get category by id
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: OK }
 *       404: { description: Not found }
 */
r.get("/category/:id", user_middleware_1.checkToken, c.getById.bind(c));
/**
 * @openapi
 * /api/categories:
 *   get:
 *     summary: List categories
 *     tags: [Categories]
 *     responses:
 *       200: { description: OK }
 */
r.get("/categories", user_middleware_1.checkToken, c.list.bind(c));
/**
 * @openapi
 * /api/category/{id}:
 *   patch:
 *     summary: Update category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 */
r.patch("/category/:id", user_middleware_1.checkToken, (0, validate_1.validateBody)(category_validation_1.updateCategorySchema), c.update.bind(c));
/**
 * @openapi
 * /api/category/{id}:
 *   delete:
 *     summary: Delete category
 *     tags: [Categories]
 */
r.delete("/category/:id", user_middleware_1.checkToken, c.delete.bind(c));
exports.default = r;
