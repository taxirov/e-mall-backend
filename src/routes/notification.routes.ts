import { Router } from "express";
import { NotificationController } from "../controllers/notification.controller";
import { checkToken } from "../middlewares/user.middleware";

const r = Router();
const c = new NotificationController();

/**
 * @openapi
 * /api/notifications/{userId}:
 *   get:
 *     summary: List notifications for a user
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: unreadOnly
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: OK
 */
r.get("/notifications/:userId", checkToken, c.list.bind(c));
/**
 * @openapi
 * /api/notifications/{userId}/read-all:
 *   post:
 *     summary: Mark all notifications as read
 *     tags: [Notifications]
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
r.post("/notifications/:userId/read-all", checkToken, c.markAllRead.bind(c));
/**
 * @openapi
 * /api/notification/{id}/read:
 *   post:
 *     summary: Mark a notification as read
 *     tags: [Notifications]
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
r.post("/notification/:id/read", checkToken, c.markRead.bind(c));

export default r;
