"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestService = void 0;
const database_1 = __importDefault(require("../database"));
const client_1 = require("@prisma/client");
const notification_service_1 = require("./notification.service");
const socket_1 = require("../realtime/socket");
class RequestService {
    constructor() {
        this.notifications = new notification_service_1.NotificationService();
    }
    /**
     * Create a request to add a user into a company by roles and salary.
     * Target can be resolved by userId or nickname/phone. Sends notification to target user.
     */
    async create(dto) {
        // resolve target user
        let targetUserId = dto.targetUserId;
        if (!targetUserId && dto.targetNicknameOrPhone) {
            const target = await database_1.default.user.findFirst({
                where: {
                    OR: [
                        { nickname: dto.targetNicknameOrPhone },
                        { phone: dto.targetNicknameOrPhone },
                    ],
                },
                select: { id: true },
            });
            if (!target)
                throw new Error("Target user not found by nickname or phone");
            targetUserId = target.id;
        }
        if (!targetUserId)
            throw new Error("targetUserId or targetNicknameOrPhone required");
        // avoid duplicate active requests
        const existing = await database_1.default.request.findFirst({
            where: { targetUserId, companyId: dto.companyId, status: { in: [client_1.RequestStatus.PENDING, client_1.RequestStatus.IN_PROGRESS] } },
            select: { id: true },
        });
        if (existing)
            throw new Error("Active request already exists for this user and company");
        const created = await database_1.default.request.create({
            data: {
                requesterId: dto.requesterId,
                targetUserId,
                companyId: dto.companyId,
                roles: Array.from(new Set(dto.roles ?? [])),
                salary: dto.salary ?? null,
                message: dto.message ?? undefined,
                status: client_1.RequestStatus.PENDING,
            },
        });
        // notify target
        await this.notifications.create(targetUserId, "Ishga taklif", `Siz ${dto.companyId} kompaniyasiga taklif qilindingiz`, { companyId: dto.companyId, requestId: created.id, roles: created.roles, salary: created.salary }, created.id);
        return created;
    }
    async getById(id) {
        return database_1.default.request.findUnique({ where: { id } });
    }
    async listIncoming(userId) {
        return database_1.default.request.findMany({ where: { targetUserId: userId }, orderBy: { createdAt: "desc" } });
    }
    async listOutgoing(userId) {
        return database_1.default.request.findMany({ where: { requesterId: userId }, orderBy: { createdAt: "desc" } });
    }
    async setStatus(id, status) {
        return database_1.default.request.update({ where: { id }, data: { status, respondedAt: status === client_1.RequestStatus.CONFIRMED || status === client_1.RequestStatus.CANCELLED ? new Date() : undefined } });
    }
    /** Accept a request: add or update membership (UserInCompany) then set status CONFIRMED. Notify requester. */
    async accept(id) {
        const req = await database_1.default.request.findUnique({ where: { id } });
        if (!req)
            throw new Error("Request not found");
        if (req.status !== client_1.RequestStatus.PENDING && req.status !== client_1.RequestStatus.IN_PROGRESS)
            throw new Error("Request is not pending");
        const membership = await database_1.default.userInCompany.upsert({
            where: { userId_companyId: { userId: req.targetUserId, companyId: req.companyId } },
            update: { roles: Array.from(new Set(req.roles)) },
            create: { userId: req.targetUserId, companyId: req.companyId, roles: Array.from(new Set(req.roles)) },
        });
        if (req.salary != null) {
            await database_1.default.user.update({ where: { id: req.targetUserId }, data: { salary: req.salary } });
        }
        const updated = await database_1.default.request.update({ where: { id }, data: { status: client_1.RequestStatus.CONFIRMED, respondedAt: new Date() } });
        // notify requester
        await this.notifications.create(req.requesterId, "So'rov qabul qilindi", `Foydalanuvchi kompaniyangizga qo'shilishni qabul qildi`, { requestId: req.id, companyId: req.companyId, userId: req.targetUserId });
        (0, socket_1.emitToUser)(req.targetUserId, 'request:updated', updated);
        (0, socket_1.emitToUser)(req.requesterId, 'request:updated', updated);
        (0, socket_1.emitToCompany)(req.companyId, 'company:member:updated', { userId: req.targetUserId, roles: membership.roles });
        return { updated, membership };
    }
    /** Decline/cancel */
    async decline(id) {
        const req = await database_1.default.request.findUnique({ where: { id } });
        if (!req)
            throw new Error("Request not found");
        if (req.status !== client_1.RequestStatus.PENDING && req.status !== client_1.RequestStatus.IN_PROGRESS)
            throw new Error("Request is not pending");
        const updated = await database_1.default.request.update({ where: { id }, data: { status: client_1.RequestStatus.CANCELLED, respondedAt: new Date() } });
        // notify requester
        await this.notifications.create(req.requesterId, "So'rov rad etildi", `Foydalanuvchi so'rovni rad etdi`, { requestId: req.id, companyId: req.companyId, userId: req.targetUserId });
        (0, socket_1.emitToUser)(req.targetUserId, 'request:updated', updated);
        (0, socket_1.emitToUser)(req.requesterId, 'request:updated', updated);
        return updated;
    }
}
exports.RequestService = RequestService;
