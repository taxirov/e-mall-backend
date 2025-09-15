"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notification_controller_1 = require("../controllers/notification.controller");
const user_middleware_1 = require("../middlewares/user.middleware");
const r = (0, express_1.Router)();
const c = new notification_controller_1.NotificationController();
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
r.get("/notifications/:userId", user_middleware_1.checkToken, c.list.bind(c));
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
r.post("/notifications/:userId/read-all", user_middleware_1.checkToken, c.markAllRead.bind(c));
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
r.post("/notification/:id/read", user_middleware_1.checkToken, c.markRead.bind(c));
exports.default = r;
