import { Router } from "express";
import { ProductInCompanyController } from "../controllers/productInCompany.controller";
import { checkToken } from "../middlewares/user.middleware";
import { validateBody } from "../middlewares/validate";
import { createProductInCompanySchema, updateProductInCompanySchema } from "../validations/productInCompany.validation";

const r = Router();
const c = new ProductInCompanyController();

/**
 * @openapi
 * /api/product-in-company:
 *   post:
 *     summary: Create product-in-company record
 *     tags: [ProductInCompany]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [productId, companyId]
 *             properties:
 *               productId: { type: integer }
 *               companyId: { type: integer }
 *               categoryId: { type: integer, nullable: true }
 *               subCategoryId: { type: integer, nullable: true }
 *               barcode: { type: string }
 *               description: { type: string }
 *               price: { type: number }
 *               discountPrice: { type: number, nullable: true }
 *               stock: { type: integer }
 *               lowStock: { type: integer }
 *               isFeatured: { type: boolean }
 *               minAge: { type: integer }
 *               maxAge: { type: integer }
 *               images: { type: array, items: { type: string } }
 *               weight: { type: number, nullable: true }
 *               status: { type: string }
 *               unit: { type: string }
 *               currency: { type: string }
 */
r.post("/product-in-company", checkToken, validateBody(createProductInCompanySchema), c.create.bind(c));
/**
 * @openapi
 * /api/product-in-company/{id}:
 *   get:
 *     summary: Get product-in-company by id
 *     tags: [ProductInCompany]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: OK }
 *       404: { description: Not found }
 */
r.get("/product-in-company/:id", checkToken, c.getById.bind(c));
/**
 * @openapi
 * /api/product-in-companies:
 *   get:
 *     summary: List product-in-company items
 *     tags: [ProductInCompany]
 *     parameters:
 *       - in: query
 *         name: companyId
 *         schema: { type: integer }
 *       - in: query
 *         name: productId
 *         schema: { type: integer }
 *       - in: query
 *         name: categoryId
 *         schema: { type: integer }
 *       - in: query
 *         name: status
 *         schema: { type: string }
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *     responses:
 *       200: { description: OK }
 */
r.get("/product-in-companies", checkToken, c.list.bind(c));
/**
 * @openapi
 * /api/product-in-company/{id}:
 *   patch:
 *     summary: Update product-in-company
 *     tags: [ProductInCompany]
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
 *               productId: { type: integer }
 *               companyId: { type: integer }
 *               categoryId: { type: integer, nullable: true }
 *               subCategoryId: { type: integer, nullable: true }
 *               barcode: { type: string }
 *               description: { type: string }
 *               price: { type: number }
 *               discountPrice: { type: number, nullable: true }
 *               stock: { type: integer }
 *               lowStock: { type: integer }
 *               isFeatured: { type: boolean }
 *               minAge: { type: integer }
 *               maxAge: { type: integer }
 *               images: { type: array, items: { type: string } }
 *               weight: { type: number, nullable: true }
 *               status: { type: string }
 *               unit: { type: string }
 *               currency: { type: string }
 */
r.patch("/product-in-company/:id", checkToken, validateBody(updateProductInCompanySchema), c.update.bind(c));
/**
 * @openapi
 * /api/product-in-company/{id}:
 *   delete:
 *     summary: Delete product-in-company
 *     tags: [ProductInCompany]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: OK }
 */
r.delete("/product-in-company/:id", checkToken, c.delete.bind(c));

export default r;
