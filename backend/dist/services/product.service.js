"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const database_1 = __importDefault(require("../database"));
const client_1 = require("@prisma/client");
const socket_1 = require("../realtime/socket");
class ProductService {
    async create(dto) {
        const data = {
            name: dto.name,
            minAge: dto.minAge ?? 0,
            maxAge: dto.maxAge ?? 100,
            tags: dto.tags ?? [],
            dimensions: dto.dimensions ?? undefined,
            seasonality: dto.seasonality ?? client_1.Seasonality.ALL_YEAR,
            category: dto.categoryId ? { connect: { id: dto.categoryId } } : undefined,
            subCategory: dto.subCategoryId ? { connect: { id: dto.subCategoryId } } : undefined,
            Company: dto.companyId ? { connect: { id: dto.companyId } } : undefined,
        };
        const created = await database_1.default.product.create({ data });
        if (dto.companyId)
            (0, socket_1.emitToCompany)(dto.companyId, 'product:created', created);
        else
            (0, socket_1.emitAll)('product:created', created);
        return created;
    }
    async getById(id) {
        return database_1.default.product.findUnique({ where: { id } });
    }
    async list(params) {
        const where = {
            AND: [
                params?.categoryId ? { categoryId: params.categoryId } : {},
                params?.subCategoryId ? { subCategoryId: params.subCategoryId } : {},
                params?.companyId ? { companyId: params.companyId } : {},
                params?.q
                    ? { OR: [{ name: { contains: params.q, mode: "insensitive" } }, { tags: { has: params.q } }] }
                    : {},
            ],
        };
        return database_1.default.product.findMany({ where, orderBy: { createdAt: "desc" } });
    }
    async update(id, dto) {
        const data = {
            name: dto.name ?? undefined,
            minAge: dto.minAge === undefined ? undefined : dto.minAge,
            maxAge: dto.maxAge === undefined ? undefined : dto.maxAge,
            tags: dto.tags === undefined ? undefined : dto.tags,
            dimensions: dto.dimensions === undefined ? undefined : dto.dimensions,
            seasonality: dto.seasonality === undefined ? undefined : dto.seasonality,
            category: dto.categoryId === undefined ? undefined : dto.categoryId ? { connect: { id: dto.categoryId } } : { disconnect: true },
            subCategory: dto.subCategoryId === undefined ? undefined : dto.subCategoryId ? { connect: { id: dto.subCategoryId } } : { disconnect: true },
            Company: dto.companyId === undefined ? undefined : dto.companyId ? { connect: { id: dto.companyId } } : { disconnect: true },
        };
        return database_1.default.product.update({ where: { id }, data });
    }
    async delete(id) {
        return database_1.default.product.delete({ where: { id } });
    }
}
exports.ProductService = ProductService;
