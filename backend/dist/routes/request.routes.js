"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const request_controller_1 = require("../controllers/request.controller");
const user_middleware_1 = require("../middlewares/user.middleware");
const validate_1 = require("../middlewares/validate");
const request_validation_1 = require("../validations/request.validation");
const r = (0, express_1.Router)();
const c = new request_controller_1.CompanyRequestController();
// Create request (by requester)
/**
 * @openapi
 * /api/request:
 *   post:
 *     summary: Create a company membership request for a user
 *     tags: [Requests]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               requesterId:
 *                 type: integer
 *               companyId:
 *                 type: integer
 *               targetUserId:
 *                 type: integer
 *               targetNicknameOrPhone:
 *                 type: string
 *               roles:
 *                 type: array
 *                 items:
 *                   type: string
 *               salary:
 *                 type: integer
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 */
r.post("/request", user_middleware_1.checkToken, (0, validate_1.validateBody)(request_validation_1.createRequestSchema), c.create.bind(c));
// Get request
/**
 * @openapi
 * /api/request/{id}:
 *   get:
 *     summary: Get request by id
 *     tags: [Requests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: OK
 */
r.get("/request/:id", user_middleware_1.checkToken, c.getById.bind(c));
// Incoming/Outgoing lists for a user
/**
 * @openapi
 * /api/requests/incoming/{userId}:
 *   get:
 *     summary: List incoming requests for the user
 *     tags: [Requests]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: OK
 */
r.get("/requests/incoming/:userId", user_middleware_1.checkToken, c.incoming.bind(c));
/**
 * @openapi
 * /api/requests/outgoing/{userId}:
 *   get:
 *     summary: List outgoing requests created by the user
 *     tags: [Requests]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: OK
 */
r.get("/requests/outgoing/:userId", user_middleware_1.checkToken, c.outgoing.bind(c));
// Accept/Decline
/**
 * @openapi
 * /api/request/{id}/accept:
 *   post:
 *     summary: Accept a request
 *     tags: [Requests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Accepted
 */
r.post("/request/:id/accept", user_middleware_1.checkToken, c.accept.bind(c));
/**
 * @openapi
 * /api/request/{id}/decline:
 *   post:
 *     summary: Decline a request
 *     tags: [Requests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Declined
 */
r.post("/request/:id/decline", user_middleware_1.checkToken, c.decline.bind(c));
exports.default = r;
