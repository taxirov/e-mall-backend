import { Router } from "express";
import { CompanyRequestController } from "../controllers/request.controller";
import { checkToken } from "../middlewares/user.middleware";
import { validateBody } from "../middlewares/validate";
import { createRequestSchema } from "../validations/request.validation";

const r = Router();
const c = new CompanyRequestController();

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
r.post("/request", checkToken, validateBody(createRequestSchema), c.create.bind(c));

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
r.get("/request/:id", checkToken, c.getById.bind(c));

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
r.get("/requests/incoming/:userId", checkToken, c.incoming.bind(c));
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
r.get("/requests/outgoing/:userId", checkToken, c.outgoing.bind(c));

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
r.post("/request/:id/accept", checkToken, c.accept.bind(c));
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
r.post("/request/:id/decline", checkToken, c.decline.bind(c));

export default r;
