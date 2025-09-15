import prisma from "../database";
import { Prisma, Seasonality } from "@prisma/client";
import { emitAll, emitToCompany } from "../realtime/socket";
import { CreateProductDto, UpdateProductDto } from "../models/product.model";

export class ProductService {
  async create(dto: CreateProductDto) {
    const data: Prisma.ProductCreateInput = {
      name: dto.name,
      minAge: dto.minAge ?? 0,
      maxAge: dto.maxAge ?? 100,
      tags: dto.tags ?? [],
      dimensions: dto.dimensions ?? undefined,
      seasonality: dto.seasonality ?? Seasonality.ALL_YEAR,
      category: dto.categoryId ? { connect: { id: dto.categoryId } } : undefined,
      subCategory: dto.subCategoryId ? { connect: { id: dto.subCategoryId } } : undefined,
      Company: dto.companyId ? { connect: { id: dto.companyId } } : undefined,
    };
    const created = await prisma.product.create({ data });
    if (dto.companyId) emitToCompany(dto.companyId, 'product:created', created);
    else emitAll('product:created', created);
    return created;
  }

  async getById(id: number) {
    return prisma.product.findUnique({ where: { id } });
  }

  async list(params?: { q?: string; categoryId?: number; subCategoryId?: number; companyId?: number }) {
    const where: Prisma.ProductWhereInput = {
      AND: [
        params?.categoryId ? { categoryId: params.categoryId } : {},
        params?.subCategoryId ? { subCategoryId: params.subCategoryId } : {},
        params?.companyId ? { companyId: params.companyId } : {},
        params?.q
          ? { OR: [{ name: { contains: params.q, mode: "insensitive" } }, { tags: { has: params.q } }] }
          : {},
      ],
    };
    return prisma.product.findMany({ where, orderBy: { createdAt: "desc" } });
  }

  async update(id: number, dto: UpdateProductDto) {
    const data: Prisma.ProductUpdateInput = {
      name: dto.name ?? undefined,
      minAge: dto.minAge === undefined ? undefined : dto.minAge,
      maxAge: dto.maxAge === undefined ? undefined : dto.maxAge,
      tags: dto.tags === undefined ? undefined : dto.tags,
      dimensions: dto.dimensions === undefined ? undefined : dto.dimensions,
      seasonality: dto.seasonality === undefined ? undefined : dto.seasonality,
      category: dto.categoryId === undefined ? undefined : dto.categoryId ? { connect: { id: dto.categoryId } } : { disconnect: true },
      subCategory:
        dto.subCategoryId === undefined ? undefined : dto.subCategoryId ? { connect: { id: dto.subCategoryId } } : { disconnect: true },
      Company: dto.companyId === undefined ? undefined : dto.companyId ? { connect: { id: dto.companyId } } : { disconnect: true },
    };
    return prisma.product.update({ where: { id }, data });
  }

  async delete(id: number) {
    return prisma.product.delete({ where: { id } });
  }
}
