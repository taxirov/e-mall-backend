"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyOnStorageService = void 0;
const database_1 = __importDefault(require("../database"));
class CompanyOnStorageService {
    async link(dto) {
        return database_1.default.companyOnStorage.upsert({
            where: { companyId_storageId: { companyId: dto.companyId, storageId: dto.storageId } },
            update: { isPrimary: dto.isPrimary ?? false },
            create: { companyId: dto.companyId, storageId: dto.storageId, isPrimary: dto.isPrimary ?? false },
        });
    }
    async unlink(companyId, storageId) {
        return database_1.default.companyOnStorage.delete({ where: { companyId_storageId: { companyId, storageId } } });
    }
    async listStorages(companyId) {
        return database_1.default.companyOnStorage.findMany({ where: { companyId }, include: { storage: true } });
    }
    async listCompanies(storageId) {
        return database_1.default.companyOnStorage.findMany({ where: { storageId }, include: { company: true } });
    }
    async setPrimary(companyId, storageId, isPrimary) {
        return database_1.default.companyOnStorage.update({ where: { companyId_storageId: { companyId, storageId } }, data: { isPrimary } });
    }
}
exports.CompanyOnStorageService = CompanyOnStorageService;
