"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BranchService = void 0;
const database_1 = __importDefault(require("../database"));
class BranchService {
    async create(dto) {
        const data = {
            name: dto.name,
            desc: dto.desc ?? undefined,
            address: dto.address,
            mainPhone: dto.mainPhone ?? undefined,
            phones: dto.phones ?? [],
            company: { connect: { id: dto.companyId } },
        };
        return database_1.default.branch.create({ data });
    }
    async getById(id) {
        return database_1.default.branch.findUnique({ where: { id } });
    }
    async list(params) {
        const where = {
            AND: [
                params?.companyId ? { companyId: params.companyId } : {},
                params?.q
                    ? { OR: [{ name: { contains: params.q, mode: "insensitive" } }, { mainPhone: { contains: params.q } }] }
                    : {},
            ],
        };
        return database_1.default.branch.findMany({ where, orderBy: { createdAt: "desc" } });
    }
    async update(id, dto) {
        const data = {
            name: dto.name ?? undefined,
            desc: dto.desc === undefined ? undefined : dto.desc,
            address: dto.address === undefined ? undefined : dto.address,
            mainPhone: dto.mainPhone === undefined ? undefined : dto.mainPhone,
            phones: dto.phones === undefined ? undefined : dto.phones,
            company: dto.companyId === undefined ? undefined : { connect: { id: dto.companyId } },
        };
        return database_1.default.branch.update({ where: { id }, data });
    }
    async delete(id) {
        return database_1.default.branch.delete({ where: { id } });
    }
}
exports.BranchService = BranchService;
