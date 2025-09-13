import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { checkToken } from "../middlewares/user.middleware";
import { validateBody } from "../middlewares/validate";
import { createProductSchema, updateProductSchema } from "../validations/product.validation";

const r = Router();
const c = new ProductController();

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
r.post("/product", checkToken, validateBody(createProductSchema), c.create.bind(c));
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
r.get("/product/:id", checkToken, c.getById.bind(c));
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
r.get("/products", checkToken, c.list.bind(c));
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
r.patch("/product/:id", checkToken, validateBody(updateProductSchema), c.update.bind(c));
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
r.delete("/product/:id", checkToken, c.delete.bind(c));

export default r;
