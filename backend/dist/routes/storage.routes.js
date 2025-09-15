"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const storage_controller_1 = require("../controllers/storage.controller");
const user_middleware_1 = require("../middlewares/user.middleware");
const validate_1 = require("../middlewares/validate");
const storage_validation_1 = require("../validations/storage.validation");
const r = (0, express_1.Router)();
const c = new storage_controller_1.StorageController();
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
r.post("/storage", user_middleware_1.checkToken, (0, validate_1.validateBody)(storage_validation_1.createStorageSchema), c.create.bind(c));
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
r.get("/storage/:id", user_middleware_1.checkToken, c.getById.bind(c));
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
r.get("/storages", user_middleware_1.checkToken, c.list.bind(c));
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
r.patch("/storage/:id", user_middleware_1.checkToken, (0, validate_1.validateBody)(storage_validation_1.updateStorageSchema), c.update.bind(c));
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
r.delete("/storage/:id", user_middleware_1.checkToken, c.delete.bind(c));
exports.default = r;
