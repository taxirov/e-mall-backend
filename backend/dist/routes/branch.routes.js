"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const branch_controller_1 = require("../controllers/branch.controller");
const user_middleware_1 = require("../middlewares/user.middleware");
const validate_1 = require("../middlewares/validate");
const branch_validation_1 = require("../validations/branch.validation");
const r = (0, express_1.Router)();
const c = new branch_controller_1.BranchController();
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
r.post("/branch", user_middleware_1.checkToken, (0, validate_1.validateBody)(branch_validation_1.createBranchSchema), c.create.bind(c));
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
r.get("/branch/:id", user_middleware_1.checkToken, c.getById.bind(c));
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
r.get("/branches", user_middleware_1.checkToken, c.list.bind(c));
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
r.patch("/branch/:id", user_middleware_1.checkToken, (0, validate_1.validateBody)(branch_validation_1.updateBranchSchema), c.update.bind(c));
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
r.delete("/branch/:id", user_middleware_1.checkToken, c.delete.bind(c));
exports.default = r;
