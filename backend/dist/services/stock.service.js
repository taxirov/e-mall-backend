"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockService = void 0;
const database_1 = __importDefault(require("../database"));
const socket_1 = require("../realtime/socket");
const database_2 = __importDefault(require("../database"));
class StockService {
    async upsert(dto) {
        const result = await database_1.default.stock.upsert({
            where: { locationId_productId: { locationId: dto.locationId, productId: dto.productId } },
            create: { locationId: dto.locationId, productId: dto.productId, quantity: dto.quantity ?? 0 },
            update: { quantity: dto.quantity ?? 0 },
        });
        const loc = await database_2.default.inventoryLocation.findUnique({ where: { id: result.locationId }, select: { companyId: true } });
        if (loc?.companyId)
            (0, socket_1.emitToCompany)(loc.companyId, 'stock:updated', result);
        return result;
    }
    async get(locationId, productId) {
        return database_1.default.stock.findUnique({ where: { locationId_productId: { locationId, productId } } });
    }
    async list(params) {
        const where = {
            AND: [
                params?.locationId ? { locationId: params.locationId } : {},
                params?.productId ? { productId: params.productId } : {},
            ],
        };
        return database_1.default.stock.findMany({ where, orderBy: { id: "desc" } });
    }
    async update(locationId, productId, dto) {
        const data = {
            quantity: dto.quantity === undefined ? undefined : dto.quantity,
            location: dto.locationId === undefined ? undefined : { connect: { id: dto.locationId } },
            product: dto.productId === undefined ? undefined : { connect: { id: dto.productId } },
        };
        const updated = await database_1.default.stock.update({ where: { locationId_productId: { locationId, productId } }, data });
        const loc = await database_2.default.inventoryLocation.findUnique({ where: { id: updated.locationId }, select: { companyId: true } });
        if (loc?.companyId)
            (0, socket_1.emitToCompany)(loc.companyId, 'stock:updated', updated);
        return updated;
    }
    async delete(locationId, productId) {
        const deleted = await database_1.default.stock.delete({ where: { locationId_productId: { locationId, productId } } });
        const loc = await database_2.default.inventoryLocation.findUnique({ where: { id: deleted.locationId }, select: { companyId: true } });
        if (loc?.companyId)
            (0, socket_1.emitToCompany)(loc.companyId, 'stock:deleted', deleted);
        return deleted;
    }
}
exports.StockService = StockService;
