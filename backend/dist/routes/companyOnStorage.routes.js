"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const companyOnStorage_controller_1 = require("../controllers/companyOnStorage.controller");
const user_middleware_1 = require("../middlewares/user.middleware");
const validate_1 = require("../middlewares/validate");
const joi_1 = __importDefault(require("joi"));
const r = (0, express_1.Router)();
const c = new companyOnStorage_controller_1.CompanyOnStorageController();
const linkSchema = joi_1.default.object({ companyId: joi_1.default.number().integer().required(), storageId: joi_1.default.number().integer().required(), isPrimary: joi_1.default.boolean().default(false) });
const setPrimarySchema = joi_1.default.object({ isPrimary: joi_1.default.boolean().required() });
/**
 * @openapi
 * /api/company-storage:
 *   post:
 *     summary: Link company to storage
 *     tags: [CompanyStorage]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [companyId, storageId]
 *             properties:
 *               companyId: { type: integer }
 *               storageId: { type: integer }
 *               isPrimary: { type: boolean }
 *     responses:
 *       201: { description: Created }
 */
r.post("/company-storage", user_middleware_1.checkToken, (0, validate_1.validateBody)(linkSchema), c.link.bind(c));
/**
 * @openapi
 * /api/company-storage/{companyId}/{storageId}:
 *   delete:
 *     summary: Unlink company from storage
 *     tags: [CompanyStorage]
 *     parameters:
 *       - in: path
 *         name: companyId
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: storageId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: OK }
 */
r.delete("/company-storage/:companyId/:storageId", user_middleware_1.checkToken, c.unlink.bind(c));
/**
 * @openapi
 * /api/company-storage/company/{companyId}:
 *   get:
 *     summary: List storages of a company
 *     tags: [CompanyStorage]
 *     parameters:
 *       - in: path
 *         name: companyId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: OK }
 */
r.get("/company-storage/company/:companyId", user_middleware_1.checkToken, c.listStorages.bind(c));
/**
 * @openapi
 * /api/company-storage/storage/{storageId}:
 *   get:
 *     summary: List companies linked to a storage
 *     tags: [CompanyStorage]
 *     parameters:
 *       - in: path
 *         name: storageId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: OK }
 */
r.get("/company-storage/storage/:storageId", user_middleware_1.checkToken, c.listCompanies.bind(c));
/**
 * @openapi
 * /api/company-storage/{companyId}/{storageId}/primary:
 *   patch:
 *     summary: Set company primary storage link
 *     tags: [CompanyStorage]
 *     parameters:
 *       - in: path
 *         name: companyId
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: storageId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [isPrimary]
 *             properties:
 *               isPrimary: { type: boolean }
 *     responses:
 *       200: { description: OK }
 */
r.patch("/company-storage/:companyId/:storageId/primary", user_middleware_1.checkToken, (0, validate_1.validateBody)(setPrimarySchema), c.setPrimary.bind(c));
exports.default = r;
