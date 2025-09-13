import { Router } from "express";
import { CategoryController } from "../controllers/category.controller";
import { checkToken } from "../middlewares/user.middleware";
import { validateBody } from "../middlewares/validate";
import { createCategorySchema, updateCategorySchema } from "../validations/category.validation";

const r = Router();
const c = new CategoryController();

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
r.post("/category", checkToken, validateBody(createCategorySchema), c.create.bind(c));
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
r.get("/category/:id", checkToken, c.getById.bind(c));
/**
 * @openapi
 * /api/categories:
 *   get:
 *     summary: List categories
 *     tags: [Categories]
 *     responses:
 *       200: { description: OK }
 */
r.get("/categories", checkToken, c.list.bind(c));
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
r.patch("/category/:id", checkToken, validateBody(updateCategorySchema), c.update.bind(c));
/**
 * @openapi
 * /api/category/{id}:
 *   delete:
 *     summary: Delete category
 *     tags: [Categories]
 */
r.delete("/category/:id", checkToken, c.delete.bind(c));

export default r;
