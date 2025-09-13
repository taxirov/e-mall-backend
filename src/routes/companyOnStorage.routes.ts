import { Router } from "express";
import { CompanyOnStorageController } from "../controllers/companyOnStorage.controller";
import { checkToken } from "../middlewares/user.middleware";
import { validateBody } from "../middlewares/validate";
import Joi from "joi";

const r = Router();
const c = new CompanyOnStorageController();

const linkSchema = Joi.object({ companyId: Joi.number().integer().required(), storageId: Joi.number().integer().required(), isPrimary: Joi.boolean().default(false) });
const setPrimarySchema = Joi.object({ isPrimary: Joi.boolean().required() });

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
r.post("/company-storage", checkToken, validateBody(linkSchema), c.link.bind(c));
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
r.delete("/company-storage/:companyId/:storageId", checkToken, c.unlink.bind(c));
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
r.get("/company-storage/company/:companyId", checkToken, c.listStorages.bind(c));
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
r.get("/company-storage/storage/:storageId", checkToken, c.listCompanies.bind(c));
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
r.patch("/company-storage/:companyId/:storageId/primary", checkToken, validateBody(setPrimarySchema), c.setPrimary.bind(c));

export default r;
