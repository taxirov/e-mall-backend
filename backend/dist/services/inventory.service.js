"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryService = void 0;
const database_1 = __importDefault(require("../database"));
class InventoryService {
    async createLocation(dto) {
        const data = {
            type: dto.type,
            company: dto.companyId ? { connect: { id: dto.companyId } } : undefined,
            branch: dto.branchId ? { connect: { id: dto.branchId } } : undefined,
            storage: dto.storageId ? { connect: { id: dto.storageId } } : undefined,
        };
        return database_1.default.inventoryLocation.create({ data });
    }
    async getLocationById(id) {
        return database_1.default.inventoryLocation.findUnique({ where: { id } });
    }
    async listLocations(params) {
        const where = {
            AND: [
                params?.type ? { type: params.type } : {},
                params?.companyId ? { companyId: params.companyId } : {},
                params?.branchId ? { branchId: params.branchId } : {},
                params?.storageId ? { storageId: params.storageId } : {},
            ],
        };
        return database_1.default.inventoryLocation.findMany({ where, orderBy: { createdAt: "desc" } });
    }
    async updateLocation(id, dto) {
        const data = {
            type: dto.type ?? undefined,
            company: dto.companyId === undefined ? undefined : dto.companyId ? { connect: { id: dto.companyId } } : { disconnect: true },
            branch: dto.branchId === undefined ? undefined : dto.branchId ? { connect: { id: dto.branchId } } : { disconnect: true },
            storage: dto.storageId === undefined ? undefined : dto.storageId ? { connect: { id: dto.storageId } } : { disconnect: true },
        };
        return database_1.default.inventoryLocation.update({ where: { id }, data });
    }
    async deleteLocation(id) {
        return database_1.default.inventoryLocation.delete({ where: { id } });
    }
}
exports.InventoryService = InventoryService;
