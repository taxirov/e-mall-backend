"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const subcategory_controller_1 = require("../controllers/subcategory.controller");
const user_middleware_1 = require("../middlewares/user.middleware");
const validate_1 = require("../middlewares/validate");
const subcategory_validation_1 = require("../validations/subcategory.validation");
const r = (0, express_1.Router)();
const c = new subcategory_controller_1.SubCategoryController();
/**
 * @openapi
 * /api/subcategory:
 *   post:
 *     summary: Create subcategory
 *     tags: [SubCategories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, categoryId]
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               categoryId:
 *                 type: integer
 */
r.post("/subcategory", user_middleware_1.checkToken, (0, validate_1.validateBody)(subcategory_validation_1.createSubCategorySchema), c.create.bind(c));
/**
 * @openapi
 * /api/subcategory/{id}:
 *   get:
 *     summary: Get subcategory by id
 *     tags: [SubCategories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: OK }
 *       404: { description: Not found }
 */
r.get("/subcategory/:id", user_middleware_1.checkToken, c.getById.bind(c));
/**
 * @openapi
 * /api/subcategories:
 *   get:
 *     summary: List subcategories
 *     tags: [SubCategories]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *       - in: query
 *         name: categoryId
 *         schema: { type: integer }
 *     responses:
 *       200: { description: OK }
 */
r.get("/subcategories", user_middleware_1.checkToken, c.list.bind(c));
/**
 * @openapi
 * /api/subcategory/{id}:
 *   patch:
 *     summary: Update subcategory
 *     tags: [SubCategories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
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
 *               categoryId:
 *                 type: integer
 */
r.patch("/subcategory/:id", user_middleware_1.checkToken, (0, validate_1.validateBody)(subcategory_validation_1.updateSubCategorySchema), c.update.bind(c));
/**
 * @openapi
 * /api/subcategory/{id}:
 *   delete:
 *     summary: Delete subcategory
 *     tags: [SubCategories]
 */
r.delete("/subcategory/:id", user_middleware_1.checkToken, c.delete.bind(c));
exports.default = r;
