"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageService = void 0;
const database_1 = __importDefault(require("../database"));
class StorageService {
    async create(dto) {
        const data = {
            name: dto.name,
            desc: dto.desc ?? undefined,
            address: dto.address,
            mainPhone: dto.mainPhone ?? undefined,
            phones: dto.phones ?? [],
        };
        return database_1.default.storage.create({ data });
    }
    async getById(id) {
        return database_1.default.storage.findUnique({ where: { id } });
    }
    async list(q) {
        const where = q
            ? { OR: [{ name: { contains: q, mode: "insensitive" } }, { mainPhone: { contains: q } }] }
            : {};
        return database_1.default.storage.findMany({ where, orderBy: { createdAt: "desc" } });
    }
    async update(id, dto) {
        const data = {
            name: dto.name ?? undefined,
            desc: dto.desc === undefined ? undefined : dto.desc,
            address: dto.address === undefined ? undefined : dto.address,
            mainPhone: dto.mainPhone === undefined ? undefined : dto.mainPhone,
            phones: dto.phones === undefined ? undefined : dto.phones,
        };
        return database_1.default.storage.update({ where: { id }, data });
    }
    async delete(id) {
        return database_1.default.storage.delete({ where: { id } });
    }
}
exports.StorageService = StorageService;
