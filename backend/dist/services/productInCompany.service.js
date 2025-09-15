"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductInCompanyService = void 0;
const database_1 = __importDefault(require("../database"));
const client_1 = require("@prisma/client");
const socket_1 = require("../realtime/socket");
class ProductInCompanyService {
    async create(dto) {
        const data = {
            product: { connect: { id: dto.productId } },
            company: { connect: { id: dto.companyId } },
            category: dto.categoryId ? { connect: { id: dto.categoryId } } : undefined,
            subCategory: dto.subCategoryId ? { connect: { id: dto.subCategoryId } } : undefined,
            barcode: dto.barcode ?? undefined,
            description: dto.description ?? undefined,
            price: (dto.price ?? 0),
            discountPrice: (dto.discountPrice ?? null),
            stock: dto.stock ?? 0,
            lowStock: dto.lowStock ?? 3,
            isFeatured: dto.isFeatured ?? false,
            minAge: dto.minAge ?? 0,
            maxAge: dto.maxAge ?? 100,
            images: dto.images ?? [],
            weight: (dto.weight ?? null),
            viewCount: dto.viewCount ?? 0,
            publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : undefined,
            status: dto.status ?? client_1.ProductStatus.ACTIVE,
            unit: dto.unit ?? client_1.Unit.PIECE,
            currency: dto.currency ?? client_1.Currency.UZS,
        };
        const created = await database_1.default.productInCompany.create({ data });
        (0, socket_1.emitToCompany)(created.companyId, 'productInCompany:created', created);
        return created;
    }
    async getById(id) {
        return database_1.default.productInCompany.findUnique({ where: { id } });
    }
    async list(params) {
        const where = {
            AND: [
                params?.companyId ? { companyId: params.companyId } : {},
                params?.productId ? { productId: params.productId } : {},
                params?.categoryId ? { categoryId: params.categoryId } : {},
                params?.status ? { status: params.status } : {},
                params?.q ? { OR: [{ barcode: { contains: params.q, mode: "insensitive" } }] } : {},
            ],
        };
        return database_1.default.productInCompany.findMany({ where, orderBy: { createdAt: "desc" } });
    }
    async update(id, dto) {
        const data = {
            category: dto.categoryId === undefined ? undefined : dto.categoryId ? { connect: { id: dto.categoryId } } : { disconnect: true },
            subCategory: dto.subCategoryId === undefined ? undefined : dto.subCategoryId ? { connect: { id: dto.subCategoryId } } : { disconnect: true },
            barcode: dto.barcode === undefined ? undefined : dto.barcode,
            description: dto.description === undefined ? undefined : dto.description,
            price: dto.price === undefined ? undefined : dto.price,
            discountPrice: dto.discountPrice === undefined ? undefined : dto.discountPrice,
            stock: dto.stock === undefined ? undefined : dto.stock,
            lowStock: dto.lowStock === undefined ? undefined : dto.lowStock,
            isFeatured: dto.isFeatured === undefined ? undefined : dto.isFeatured,
            minAge: dto.minAge === undefined ? undefined : dto.minAge,
            maxAge: dto.maxAge === undefined ? undefined : dto.maxAge,
            images: dto.images === undefined ? undefined : dto.images,
            weight: dto.weight === undefined ? undefined : dto.weight,
            viewCount: dto.viewCount === undefined ? undefined : dto.viewCount,
            publishedAt: dto.publishedAt === undefined ? undefined : dto.publishedAt ? new Date(dto.publishedAt) : null,
            status: dto.status === undefined ? undefined : dto.status,
            unit: dto.unit === undefined ? undefined : dto.unit,
            currency: dto.currency === undefined ? undefined : dto.currency,
            product: dto.productId === undefined ? undefined : { connect: { id: dto.productId } },
            company: dto.companyId === undefined ? undefined : { connect: { id: dto.companyId } },
        };
        const updated = await database_1.default.productInCompany.update({ where: { id }, data });
        (0, socket_1.emitToCompany)(updated.companyId, 'productInCompany:updated', updated);
        return updated;
    }
    async delete(id) {
        const deleted = await database_1.default.productInCompany.delete({ where: { id } });
        (0, socket_1.emitToCompany)(deleted.companyId, 'productInCompany:deleted', deleted);
        return deleted;
    }
}
exports.ProductInCompanyService = ProductInCompanyService;
