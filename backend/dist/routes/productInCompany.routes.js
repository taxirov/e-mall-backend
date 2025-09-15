"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productInCompany_controller_1 = require("../controllers/productInCompany.controller");
const user_middleware_1 = require("../middlewares/user.middleware");
const validate_1 = require("../middlewares/validate");
const productInCompany_validation_1 = require("../validations/productInCompany.validation");
const r = (0, express_1.Router)();
const c = new productInCompany_controller_1.ProductInCompanyController();
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
r.post("/product-in-company", user_middleware_1.checkToken, (0, validate_1.validateBody)(productInCompany_validation_1.createProductInCompanySchema), c.create.bind(c));
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
r.get("/product-in-company/:id", user_middleware_1.checkToken, c.getById.bind(c));
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
r.get("/product-in-companies", user_middleware_1.checkToken, c.list.bind(c));
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
r.patch("/product-in-company/:id", user_middleware_1.checkToken, (0, validate_1.validateBody)(productInCompany_validation_1.updateProductInCompanySchema), c.update.bind(c));
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
r.delete("/product-in-company/:id", user_middleware_1.checkToken, c.delete.bind(c));
exports.default = r;
