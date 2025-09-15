"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
const database_1 = __importDefault(require("../database"));
class CategoryService {
    async create(dto) {
        return database_1.default.category.create({ data: { name: dto.name, description: dto.description ?? undefined } });
    }
    async getById(id) {
        return database_1.default.category.findUnique({ where: { id } });
    }
    async list(q) {
        const where = q
            ? { OR: [{ name: { contains: q, mode: "insensitive" } }, { description: { contains: q, mode: "insensitive" } }] }
            : {};
        return database_1.default.category.findMany({ where, orderBy: { createdAt: "desc" } });
    }
    async update(id, dto) {
        const data = {
            name: dto.name ?? undefined,
            description: dto.description === undefined ? undefined : dto.description,
        };
        return database_1.default.category.update({ where: { id }, data });
    }
    async delete(id) {
        return database_1.default.category.delete({ where: { id } });
    }
}
exports.CategoryService = CategoryService;
