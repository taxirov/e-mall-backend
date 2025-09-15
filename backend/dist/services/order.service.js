"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const database_1 = __importDefault(require("../database"));
const client_1 = require("@prisma/client");
const socket_1 = require("../realtime/socket");
class OrderService {
    async create(dto) {
        return database_1.default.$transaction(async (tx) => {
            const order = await tx.order.create({ data: { status: dto.status ?? client_1.OrderStatus.PENDING } });
            if (dto.items?.length) {
                await tx.productInOrder.createMany({
                    data: dto.items.map((i) => ({ orderId: order.id, productId: i.productId, quantity: i.quantity ?? 1, price: i.price, productInCompanyId: i.productInCompanyId ?? null })),
                });
            }
            const full = await tx.order.findUniqueOrThrow({ where: { id: order.id }, include: { ProductInOrder: true, assignments: true } });
            (0, socket_1.emitToOrder)(full.id, 'order:created', full);
            return full;
        });
    }
    async getById(id) {
        return database_1.default.order.findUnique({ where: { id }, include: { ProductInOrder: true, assignments: true } });
    }
    async list(params) {
        const where = params?.status ? { status: params.status } : {};
        return database_1.default.order.findMany({ where, orderBy: { createdAt: "desc" }, include: { ProductInOrder: true, assignments: true } });
    }
    async setStatus(id, status) {
        const upd = await database_1.default.order.update({ where: { id }, data: { status } });
        (0, socket_1.emitToOrder)(id, 'order:status', upd);
        return upd;
    }
    async addItem(orderId, dto) {
        const item = await database_1.default.productInOrder.create({ data: { orderId, productId: dto.productId, quantity: dto.quantity ?? 1, price: dto.price, productInCompanyId: dto.productInCompanyId ?? null } });
        (0, socket_1.emitToOrder)(orderId, 'order:item:add', item);
        return item;
    }
    async removeItem(orderId, productId) {
        const del = await database_1.default.productInOrder.delete({ where: { orderId_productId: { orderId, productId } } });
        (0, socket_1.emitToOrder)(orderId, 'order:item:remove', del);
        return del;
    }
    async assign(orderId, dto) {
        const assign = await database_1.default.orderAssignment.upsert({
            where: { orderId_userId_role: { orderId, userId: dto.userId, role: dto.role } },
            update: {},
            create: { orderId, userId: dto.userId, role: dto.role },
        });
        (0, socket_1.emitToOrder)(orderId, 'order:assign', assign);
        return assign;
    }
    async unassign(orderId, userId, role) {
        const un = await database_1.default.orderAssignment.delete({ where: { orderId_userId_role: { orderId, userId, role: role } } });
        (0, socket_1.emitToOrder)(orderId, 'order:unassign', un);
        return un;
    }
}
exports.OrderService = OrderService;
