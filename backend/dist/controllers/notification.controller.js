"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const notification_service_1 = require("../services/notification.service");
const service = new notification_service_1.NotificationService();
class NotificationController {
    async list(req, res) {
        const userId = Number(req.params.userId);
        const unreadOnly = req.query.unreadOnly === "true";
        if (!userId)
            return res.status(400).json({ message: "userId required" });
        const list = await service.list(userId, { unreadOnly });
        res.json(list);
    }
    async markRead(req, res) {
        const id = Number(req.params.id);
        if (!id)
            return res.status(400).json({ message: "id required" });
        const item = await service.markRead(id);
        res.json(item);
    }
    async markAllRead(req, res) {
        const userId = Number(req.params.userId);
        if (!userId)
            return res.status(400).json({ message: "userId required" });
        const result = await service.markAllRead(userId);
        res.json(result);
    }
}
exports.NotificationController = NotificationController;
