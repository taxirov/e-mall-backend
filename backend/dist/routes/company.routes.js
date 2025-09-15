"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const company_controller_1 = require("../controllers/company.controller");
const user_middleware_1 = require("../middlewares/user.middleware");
const validate_1 = require("../middlewares/validate");
const company_validation_1 = require("../validations/company.validation");
const r = (0, express_1.Router)();
const c = new company_controller_1.CompanyController();
// CRUD
/**
 * @openapi
 * /api/company:
 *   post:
 *     summary: Create company
 *     tags: [Companies]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, type]
 *             properties:
 *               name: { type: string }
 *               desc: { type: string }
 *               address: { type: object }
 *               mainPhone: { type: string }
 *               phones: { type: array, items: { type: string } }
 *               bannerUrl: { type: string }
 *               logoUrl: { type: string }
 *               emails: { type: array, items: { type: string, format: email } }
 *               websiteUrl: { type: string }
 *               type: { type: string }
 *               isActive: { type: boolean }
 *               isBranch: { type: boolean }
 *               companyId: { type: integer, nullable: true }
 *               categoryIds: { type: array, items: { type: integer } }
 *     responses:
 *       201:
 *         description: Company created
 *       400:
 *         description: Validation or Prisma error
 */
r.post("/company", user_middleware_1.checkToken, (0, validate_1.validateBody)(company_validation_1.createCompanySchema), c.create.bind(c));
/**
 * @openapi
 * /api/company/{id}:
 *   get:
 *     summary: Get company by id
 *     tags: [Companies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: Not found
 */
r.get("/company/:id", user_middleware_1.checkToken, c.getById.bind(c));
/**
 * @openapi
 * /api/companies:
 *   get:
 *     summary: List companies
 *     tags: [Companies]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: pageSize
 *         schema: { type: integer }
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *       - in: query
 *         name: type
 *         schema: { type: string }
 *       - in: query
 *         name: isActive
 *         schema: { type: boolean }
 *       - in: query
 *         name: isBranch
 *         schema: { type: boolean }
 *       - in: query
 *         name: parentCompanyId
 *         schema: { type: integer }
 *       - in: query
 *         name: sortField
 *         schema: { type: string }
 *       - in: query
 *         name: sortDirection
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: OK
 */
r.get("/companies", user_middleware_1.checkToken, c.list.bind(c));
/**
 * @openapi
 * /api/company/{id}:
 *   patch:
 *     summary: Update company
 *     tags: [Companies]
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
 *               desc: { type: string, nullable: true }
 *               address: { type: object, nullable: true }
 *               mainPhone: { type: string, nullable: true }
 *               phones: { type: array, items: { type: string } }
 *               bannerUrl: { type: string, nullable: true }
 *               logoUrl: { type: string, nullable: true }
 *               emails: { type: array, items: { type: string, format: email } }
 *               websiteUrl: { type: string, nullable: true }
 *               type: { type: string }
 *               isActive: { type: boolean }
 *               isBranch: { type: boolean }
 *               companyId: { type: integer, nullable: true }
 *               addCategoryIds: { type: array, items: { type: integer } }
 *               removeCategoryIds: { type: array, items: { type: integer } }
 *               setCategoryIds: { type: array, items: { type: integer } }
 *     responses:
 *       200:
 *         description: Updated company
 */
r.patch("/company/:id", user_middleware_1.checkToken, (0, validate_1.validateBody)(company_validation_1.updateCompanySchema), c.update.bind(c));
/**
 * @openapi
 * /api/company/{id}:
 *   delete:
 *     summary: Soft delete company
 *     tags: [Companies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: OK
 */
r.delete("/company/:id", user_middleware_1.checkToken, c.softDelete.bind(c));
/**
 * @openapi
 * /api/company/{id}/restore:
 *   post:
 *     summary: Restore soft-deleted company
 *     tags: [Companies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: OK
 */
r.post("/company/:id/restore", user_middleware_1.checkToken, c.restore.bind(c));
/**
 * @openapi
 * /api/company/{id}/hard:
 *   delete:
 *     summary: Hard delete company
 *     tags: [Companies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: OK
 */
r.delete("/company/:id/hard", user_middleware_1.checkToken, c.hardDelete.bind(c));
// Membership
/**
 * @openapi
 * /api/company/{companyId}/members:
 *   put:
 *     summary: Add or update company member roles
 *     tags: [Companies]
 *     parameters:
 *       - in: path
 *         name: companyId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, roles]
 *             properties:
 *               userId: { type: integer }
 *               roles: { type: array, items: { type: string } }
 *     responses:
 *       200:
 *         description: OK
 */
r.put("/company/:companyId/members", user_middleware_1.checkToken, c.addOrUpdateUser.bind(c));
/**
 * @openapi
 * /api/company/{companyId}/members/{userId}:
 *   delete:
 *     summary: Remove member from company
 *     tags: [Companies]
 *     parameters:
 *       - in: path
 *         name: companyId
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: OK
 */
r.delete("/company/:companyId/members/:userId", user_middleware_1.checkToken, c.removeUser.bind(c));
/**
 * @openapi
 * /api/company/{companyId}/members/{userId}/roles:
 *   put:
 *     summary: Set user roles in company
 *     tags: [Companies]
 *     parameters:
 *       - in: path
 *         name: companyId
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [roles]
 *             properties:
 *               roles: { type: array, items: { type: string } }
 *     responses:
 *       200:
 *         description: OK
 */
r.put("/company/:companyId/members/:userId/roles", user_middleware_1.checkToken, c.setUserRoles.bind(c));
/**
 * @openapi
 * /api/company/{companyId}/members/{userId}/roles:
 *   post:
 *     summary: Add user roles in company
 *     tags: [Companies]
 *     parameters:
 *       - in: path
 *         name: companyId
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [roles]
 *             properties:
 *               roles: { type: array, items: { type: string } }
 *     responses:
 *       200:
 *         description: OK
 */
r.post("/company/:companyId/members/:userId/roles", user_middleware_1.checkToken, c.addUserRoles.bind(c));
/**
 * @openapi
 * /api/company/{companyId}/members/{userId}/roles:
 *   delete:
 *     summary: Remove user roles in company
 *     tags: [Companies]
 *     parameters:
 *       - in: path
 *         name: companyId
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [roles]
 *             properties:
 *               roles: { type: array, items: { type: string } }
 *     responses:
 *       200:
 *         description: OK
 */
r.delete("/company/:companyId/members/:userId/roles", user_middleware_1.checkToken, c.removeUserRoles.bind(c));
/**
 * @openapi
 * /api/company/{companyId}/members:
 *   get:
 *     summary: List company members
 *     tags: [Companies]
 *     parameters:
 *       - in: path
 *         name: companyId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: OK
 */
r.get("/company/:companyId/members", user_middleware_1.checkToken, c.listMembers.bind(c));
// Categories
/**
 * @openapi
 * /api/company/{companyId}/categories:
 *   post:
 *     summary: Add categories to company
 *     tags: [Companies]
 *     parameters:
 *       - in: path
 *         name: companyId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [categoryIds]
 *             properties:
 *               categoryIds: { type: array, items: { type: integer } }
 *     responses:
 *       200:
 *         description: OK
 */
r.post("/company/:companyId/categories", user_middleware_1.checkToken, c.addCategories.bind(c));
/**
 * @openapi
 * /api/company/{companyId}/categories:
 *   delete:
 *     summary: Remove categories from company
 *     tags: [Companies]
 *     parameters:
 *       - in: path
 *         name: companyId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [categoryIds]
 *             properties:
 *               categoryIds: { type: array, items: { type: integer } }
 *     responses:
 *       200:
 *         description: OK
 */
r.delete("/company/:companyId/categories", user_middleware_1.checkToken, c.removeCategories.bind(c));
/**
 * @openapi
 * /api/company/{companyId}/categories:
 *   put:
 *     summary: Replace company categories
 *     tags: [Companies]
 *     parameters:
 *       - in: path
 *         name: companyId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [categoryIds]
 *             properties:
 *               categoryIds: { type: array, items: { type: integer } }
 *     responses:
 *       200:
 *         description: OK
 */
r.put("/company/:companyId/categories", user_middleware_1.checkToken, c.setCategories.bind(c));
exports.default = r;
