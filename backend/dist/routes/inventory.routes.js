"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const inventory_controller_1 = require("../controllers/inventory.controller");
const user_middleware_1 = require("../middlewares/user.middleware");
const validate_1 = require("../middlewares/validate");
const inventory_validation_1 = require("../validations/inventory.validation");
const r = (0, express_1.Router)();
const c = new inventory_controller_1.InventoryController();
/**
 * @openapi
 * /api/inventory/location:
 *   post:
 *     summary: Create inventory location
 *     tags: [Inventory]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [type]
 *             properties:
 *               type: { type: string }
 *               companyId: { type: integer, nullable: true }
 *               branchId: { type: integer, nullable: true }
 *               storageId: { type: integer, nullable: true }
 */
r.post("/inventory/location", user_middleware_1.checkToken, (0, validate_1.validateBody)(inventory_validation_1.createLocationSchema), c.createLocation.bind(c));
/**
 * @openapi
 * /api/inventory/location/{id}:
 *   get:
 *     summary: Get inventory location by id
 *     tags: [Inventory]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: OK }
 *       404: { description: Not found }
 */
r.get("/inventory/location/:id", user_middleware_1.checkToken, c.getLocationById.bind(c));
/**
 * @openapi
 * /api/inventory/locations:
 *   get:
 *     summary: List inventory locations
 *     tags: [Inventory]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema: { type: string }
 *       - in: query
 *         name: companyId
 *         schema: { type: integer }
 *       - in: query
 *         name: branchId
 *         schema: { type: integer }
 *       - in: query
 *         name: storageId
 *         schema: { type: integer }
 *     responses:
 *       200: { description: OK }
 */
r.get("/inventory/locations", user_middleware_1.checkToken, c.listLocations.bind(c));
/**
 * @openapi
 * /api/inventory/location/{id}:
 *   patch:
 *     summary: Update inventory location
 *     tags: [Inventory]
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
 *               type: { type: string }
 *               companyId: { type: integer, nullable: true }
 *               branchId: { type: integer, nullable: true }
 *               storageId: { type: integer, nullable: true }
 */
r.patch("/inventory/location/:id", user_middleware_1.checkToken, (0, validate_1.validateBody)(inventory_validation_1.updateLocationSchema), c.updateLocation.bind(c));
/**
 * @openapi
 * /api/inventory/location/{id}:
 *   delete:
 *     summary: Delete inventory location
 *     tags: [Inventory]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: OK }
 */
r.delete("/inventory/location/:id", user_middleware_1.checkToken, c.deleteLocation.bind(c));
exports.default = r;
