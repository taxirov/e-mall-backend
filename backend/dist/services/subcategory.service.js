"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubCategoryService = void 0;
const database_1 = __importDefault(require("../database"));
class SubCategoryService {
    async create(dto) {
        return database_1.default.subCategory.create({ data: { name: dto.name, description: dto.description ?? undefined, categoryId: dto.categoryId } });
    }
    async getById(id) {
        return database_1.default.subCategory.findUnique({ where: { id } });
    }
    async list(params) {
        const where = {
            AND: [
                params?.categoryId ? { categoryId: params.categoryId } : {},
                params?.q
                    ? { OR: [{ name: { contains: params.q, mode: "insensitive" } }, { description: { contains: params.q, mode: "insensitive" } }] }
                    : {},
            ],
        };
        return database_1.default.subCategory.findMany({ where, orderBy: { createdAt: "desc" } });
    }
    async update(id, dto) {
        const data = {
            name: dto.name ?? undefined,
            description: dto.description === undefined ? undefined : dto.description,
            category: dto.categoryId === undefined ? undefined : { connect: { id: dto.categoryId } },
        };
        return database_1.default.subCategory.update({ where: { id }, data });
    }
    async delete(id) {
        return database_1.default.subCategory.delete({ where: { id } });
    }
}
exports.SubCategoryService = SubCategoryService;
