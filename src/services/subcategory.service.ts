import prisma from "../database";
import { Prisma } from "@prisma/client";
import { CreateSubCategoryDto, UpdateSubCategoryDto } from "../models/subcategory.model";

export class SubCategoryService {
  async create(dto: CreateSubCategoryDto) {
    return prisma.subCategory.create({ data: { name: dto.name, description: dto.description ?? undefined, categoryId: dto.categoryId } });
  }

  async getById(id: number) {
    return prisma.subCategory.findUnique({ where: { id } });
  }

  async list(params?: { q?: string; categoryId?: number }) {
    const where: Prisma.SubCategoryWhereInput = {
      AND: [
        params?.categoryId ? { categoryId: params.categoryId } : {},
        params?.q
          ? { OR: [{ name: { contains: params.q, mode: "insensitive" } }, { description: { contains: params.q, mode: "insensitive" } }] }
          : {},
      ],
    };
    return prisma.subCategory.findMany({ where, orderBy: { createdAt: "desc" } });
  }

  async update(id: number, dto: UpdateSubCategoryDto) {
    const data: Prisma.SubCategoryUpdateInput = {
      name: dto.name ?? undefined,
      description: dto.description === undefined ? undefined : dto.description,
      category: dto.categoryId === undefined ? undefined : { connect: { id: dto.categoryId } },
    };
    return prisma.subCategory.update({ where: { id }, data });
  }

  async delete(id: number) {
    return prisma.subCategory.delete({ where: { id } });
  }
}
