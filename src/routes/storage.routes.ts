import { Router } from "express";
import { StorageController } from "../controllers/storage.controller";
import { checkToken } from "../middlewares/user.middleware";
import { validateBody } from "../middlewares/validate";
import { createStorageSchema, updateStorageSchema } from "../validations/storage.validation";

const r = Router();
const c = new StorageController();

/**
 * @openapi
 * /api/storage:
 *   post:
 *     summary: Create storage
 *     tags: [Storages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name: { type: string }
 *               desc: { type: string }
 *               address: { type: object }
 *               mainPhone: { type: string }
 *               phones: { type: array, items: { type: string } }
 */
r.post("/storage", checkToken, validateBody(createStorageSchema), c.create.bind(c));
/**
 * @openapi
 * /api/storage/{id}:
 *   get:
 *     summary: Get storage by id
 *     tags: [Storages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: OK }
 *       404: { description: Not found }
 */
r.get("/storage/:id", checkToken, c.getById.bind(c));
/**
 * @openapi
 * /api/storages:
 *   get:
 *     summary: List storages
 *     tags: [Storages]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *     responses:
 *       200: { description: OK }
 */
r.get("/storages", checkToken, c.list.bind(c));
/**
 * @openapi
 * /api/storage/{id}:
 *   patch:
 *     summary: Update storage
 *     tags: [Storages]
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
 *               desc: { type: string }
 *               address: { type: object }
 *               mainPhone: { type: string }
 *               phones: { type: array, items: { type: string } }
 */
r.patch("/storage/:id", checkToken, validateBody(updateStorageSchema), c.update.bind(c));
/**
 * @openapi
 * /api/storage/{id}:
 *   delete:
 *     summary: Delete storage
 *     tags: [Storages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: OK }
 */
r.delete("/storage/:id", checkToken, c.delete.bind(c));

export default r;
