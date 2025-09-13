import { Router } from "express";
import { BranchController } from "../controllers/branch.controller";
import { checkToken } from "../middlewares/user.middleware";
import { validateBody } from "../middlewares/validate";
import { createBranchSchema, updateBranchSchema } from "../validations/branch.validation";

const r = Router();
const c = new BranchController();

/**
 * @openapi
 * /api/branch:
 *   post:
 *     summary: Create branch
 *     tags: [Branches]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, companyId]
 *             properties:
 *               name: { type: string }
 *               desc: { type: string }
 *               address: { type: object }
 *               mainPhone: { type: string }
 *               phones: { type: array, items: { type: string } }
 *               companyId: { type: integer }
 */
r.post("/branch", checkToken, validateBody(createBranchSchema), c.create.bind(c));
/**
 * @openapi
 * /api/branch/{id}:
 *   get:
 *     summary: Get branch by id
 *     tags: [Branches]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: OK }
 *       404: { description: Not found }
 */
r.get("/branch/:id", checkToken, c.getById.bind(c));
/**
 * @openapi
 * /api/branches:
 *   get:
 *     summary: List branches
 *     tags: [Branches]
 *     parameters:
 *       - in: query
 *         name: companyId
 *         schema: { type: integer }
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *     responses:
 *       200: { description: OK }
 */
r.get("/branches", checkToken, c.list.bind(c));
/**
 * @openapi
 * /api/branch/{id}:
 *   patch:
 *     summary: Update branch
 *     tags: [Branches]
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
 *               companyId: { type: integer }
 */
r.patch("/branch/:id", checkToken, validateBody(updateBranchSchema), c.update.bind(c));
/**
 * @openapi
 * /api/branch/{id}:
 *   delete:
 *     summary: Delete branch
 *     tags: [Branches]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: OK }
 */
r.delete("/branch/:id", checkToken, c.delete.bind(c));

export default r;
