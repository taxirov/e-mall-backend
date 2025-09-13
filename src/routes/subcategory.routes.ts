import { Router } from "express";
import { SubCategoryController } from "../controllers/subcategory.controller";
import { checkToken } from "../middlewares/user.middleware";
import { validateBody } from "../middlewares/validate";
import { createSubCategorySchema, updateSubCategorySchema } from "../validations/subcategory.validation";

const r = Router();
const c = new SubCategoryController();

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
r.post("/subcategory", checkToken, validateBody(createSubCategorySchema), c.create.bind(c));
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
r.get("/subcategory/:id", checkToken, c.getById.bind(c));
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
r.get("/subcategories", checkToken, c.list.bind(c));
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
r.patch("/subcategory/:id", checkToken, validateBody(updateSubCategorySchema), c.update.bind(c));
/**
 * @openapi
 * /api/subcategory/{id}:
 *   delete:
 *     summary: Delete subcategory
 *     tags: [SubCategories]
 */
r.delete("/subcategory/:id", checkToken, c.delete.bind(c));

export default r;
