import { Router } from "express";
import { InventoryController } from "../controllers/inventory.controller";
import { checkToken } from "../middlewares/user.middleware";
import { validateBody } from "../middlewares/validate";
import { createLocationSchema, updateLocationSchema } from "../validations/inventory.validation";

const r = Router();
const c = new InventoryController();

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
r.post("/inventory/location", checkToken, validateBody(createLocationSchema), c.createLocation.bind(c));
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
r.get("/inventory/location/:id", checkToken, c.getLocationById.bind(c));
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
r.get("/inventory/locations", checkToken, c.listLocations.bind(c));
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
r.patch("/inventory/location/:id", checkToken, validateBody(updateLocationSchema), c.updateLocation.bind(c));
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
r.delete("/inventory/location/:id", checkToken, c.deleteLocation.bind(c));

export default r;
