"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransferService = void 0;
const database_1 = __importDefault(require("../database"));
const client_1 = require("@prisma/client");
const socket_1 = require("../realtime/socket");
class TransferService {
    async create(dto) {
        return database_1.default.$transaction(async (tx) => {
            const transfer = await tx.transfer.create({ data: { fromLocationId: dto.fromLocationId, toLocationId: dto.toLocationId, note: dto.note ?? undefined, status: dto.status ?? client_1.TransferStatus.DRAFT } });
            if (dto.items?.length) {
                await tx.transferItem.createMany({ data: dto.items.map((i) => ({ transferId: transfer.id, productId: i.productId, quantity: i.quantity })) });
            }
            const full = await tx.transfer.findUniqueOrThrow({ where: { id: transfer.id }, include: { items: true } });
            // Try to derive companyId from fromLocation or toLocation
            const loc = await tx.inventoryLocation.findUnique({ where: { id: full.fromLocationId }, select: { companyId: true } });
            if (loc?.companyId)
                (0, socket_1.emitToCompany)(loc.companyId, 'transfer:created', full);
            return full;
        });
    }
    async getById(id) {
        return database_1.default.transfer.findUnique({ where: { id }, include: { items: true } });
    }
    async list(params) {
        const where = {
            AND: [
                params?.status ? { status: params.status } : {},
                params?.fromLocationId ? { fromLocationId: params.fromLocationId } : {},
                params?.toLocationId ? { toLocationId: params.toLocationId } : {},
            ],
        };
        return database_1.default.transfer.findMany({ where, orderBy: { createdAt: "desc" }, include: { items: true } });
    }
    async setStatus(id, status) {
        const upd = await database_1.default.transfer.update({ where: { id }, data: { status } });
        const loc = await database_1.default.inventoryLocation.findUnique({ where: { id: upd.fromLocationId }, select: { companyId: true } });
        if (loc?.companyId)
            (0, socket_1.emitToCompany)(loc.companyId, 'transfer:status', upd);
        return upd;
    }
    async addItem(transferId, dto) {
        const item = await database_1.default.transferItem.upsert({
            where: { transferId_productId: { transferId, productId: dto.productId } },
            create: { transferId, productId: dto.productId, quantity: dto.quantity },
            update: { quantity: dto.quantity },
        });
        const tr = await database_1.default.transfer.findUnique({ where: { id: transferId }, select: { fromLocationId: true } });
        const loc = tr ? await database_1.default.inventoryLocation.findUnique({ where: { id: tr.fromLocationId }, select: { companyId: true } }) : null;
        if (loc?.companyId)
            (0, socket_1.emitToCompany)(loc.companyId, 'transfer:item', item);
        return item;
    }
    async removeItem(transferId, productId) {
        const del = await database_1.default.transferItem.delete({ where: { transferId_productId: { transferId, productId } } });
        const tr = await database_1.default.transfer.findUnique({ where: { id: transferId }, select: { fromLocationId: true } });
        const loc = tr ? await database_1.default.inventoryLocation.findUnique({ where: { id: tr.fromLocationId }, select: { companyId: true } }) : null;
        if (loc?.companyId)
            (0, socket_1.emitToCompany)(loc.companyId, 'transfer:item:remove', del);
        return del;
    }
}
exports.TransferService = TransferService;
