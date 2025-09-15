"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const database_1 = __importDefault(require("../database"));
const socket_1 = require("../realtime/socket");
class NotificationService {
    async create(userId, title, body, data, requestId) {
        const created = await database_1.default.notification.create({ data: { userId, title, body: body ?? undefined, data, requestId: requestId ?? undefined } });
        (0, socket_1.emitToUser)(userId, 'notification:new', created);
        return created;
    }
    async list(userId, params) {
        const where = {
            userId,
            ...(params?.unreadOnly ? { readAt: null } : {}),
        };
        return database_1.default.notification.findMany({ where, orderBy: { createdAt: "desc" } });
    }
    async markRead(id) {
        return database_1.default.notification.update({ where: { id }, data: { readAt: new Date() } });
    }
    async markAllRead(userId) {
        return database_1.default.notification.updateMany({ where: { userId, readAt: null }, data: { readAt: new Date() } });
    }
}
exports.NotificationService = NotificationService;
