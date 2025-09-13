import prisma from "../database";
import { Prisma, ProductStatus, Unit, Currency } from "@prisma/client";
import { CreateProductInCompanyDto, UpdateProductInCompanyDto } from "../models/productInCompany.model";

export class ProductInCompanyService {
  async create(dto: CreateProductInCompanyDto) {
    const data: Prisma.ProductInCompanyCreateInput = {
      product: { connect: { id: dto.productId } },
      company: { connect: { id: dto.companyId } },
      category: dto.categoryId ? { connect: { id: dto.categoryId } } : undefined,
      subCategory: dto.subCategoryId ? { connect: { id: dto.subCategoryId } } : undefined,
      barcode: dto.barcode ?? undefined,
      description: dto.description ?? undefined,
      price: (dto.price ?? 0) as any,
      discountPrice: (dto.discountPrice ?? null) as any,
      stock: dto.stock ?? 0,
      lowStock: dto.lowStock ?? 3,
      isFeatured: dto.isFeatured ?? false,
      minAge: dto.minAge ?? 0,
      maxAge: dto.maxAge ?? 100,
      images: dto.images ?? [],
      weight: (dto.weight ?? null) as any,
      viewCount: dto.viewCount ?? 0,
      publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : undefined,
      status: dto.status ?? ProductStatus.ACTIVE,
      unit: dto.unit ?? Unit.PIECE,
      currency: dto.currency ?? Currency.UZS,
    };
    return prisma.productInCompany.create({ data });
  }

  async getById(id: number) {
    return prisma.productInCompany.findUnique({ where: { id } });
  }

  async list(params?: { companyId?: number; productId?: number; categoryId?: number; status?: string; q?: string }) {
    const where: Prisma.ProductInCompanyWhereInput = {
      AND: [
        params?.companyId ? { companyId: params.companyId } : {},
        params?.productId ? { productId: params.productId } : {},
        params?.categoryId ? { categoryId: params.categoryId } : {},
        params?.status ? ({ status: params.status as any } as Prisma.ProductInCompanyWhereInput) : {},
        params?.q ? { OR: [{ barcode: { contains: params.q, mode: "insensitive" } }] } : {},
      ],
    };
    return prisma.productInCompany.findMany({ where, orderBy: { createdAt: "desc" } });
  }

  async update(id: number, dto: UpdateProductInCompanyDto) {
    const data: Prisma.ProductInCompanyUpdateInput = {
      category: dto.categoryId === undefined ? undefined : dto.categoryId ? { connect: { id: dto.categoryId } } : { disconnect: true },
      subCategory:
        dto.subCategoryId === undefined ? undefined : dto.subCategoryId ? { connect: { id: dto.subCategoryId } } : { disconnect: true },
      barcode: dto.barcode === undefined ? undefined : dto.barcode,
      description: dto.description === undefined ? undefined : dto.description,
      price: dto.price === undefined ? undefined : (dto.price as any),
      discountPrice: dto.discountPrice === undefined ? undefined : (dto.discountPrice as any),
      stock: dto.stock === undefined ? undefined : dto.stock,
      lowStock: dto.lowStock === undefined ? undefined : dto.lowStock,
      isFeatured: dto.isFeatured === undefined ? undefined : dto.isFeatured,
      minAge: dto.minAge === undefined ? undefined : dto.minAge,
      maxAge: dto.maxAge === undefined ? undefined : dto.maxAge,
      images: dto.images === undefined ? undefined : dto.images,
      weight: dto.weight === undefined ? undefined : (dto.weight as any),
      viewCount: dto.viewCount === undefined ? undefined : dto.viewCount,
      publishedAt: dto.publishedAt === undefined ? undefined : dto.publishedAt ? new Date(dto.publishedAt) : null,
      status: dto.status === undefined ? undefined : dto.status,
      unit: dto.unit === undefined ? undefined : dto.unit,
      currency: dto.currency === undefined ? undefined : dto.currency,
      product: dto.productId === undefined ? undefined : { connect: { id: dto.productId } },
      company: dto.companyId === undefined ? undefined : { connect: { id: dto.companyId } },
    };
    return prisma.productInCompany.update({ where: { id }, data });
  }

  async delete(id: number) {
    return prisma.productInCompany.delete({ where: { id } });
  }
}
