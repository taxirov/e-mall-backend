import prisma from "../database";
import { Prisma } from "@prisma/client";
import { CreateCategoryDto, UpdateCategoryDto } from "../models/category.model";

export class CategoryService {
  async create(dto: CreateCategoryDto) {
    return prisma.category.create({ data: { name: dto.name, description: dto.description ?? undefined } });
  }

  async getById(id: number) {
    return prisma.category.findUnique({ where: { id } });
  }

  async list(q?: string) {
    const where: Prisma.CategoryWhereInput = q
      ? { OR: [{ name: { contains: q, mode: "insensitive" } }, { description: { contains: q, mode: "insensitive" } }] }
      : {};
    return prisma.category.findMany({ where, orderBy: { createdAt: "desc" } });
  }

  async update(id: number, dto: UpdateCategoryDto) {
    const data: Prisma.CategoryUpdateInput = {
      name: dto.name ?? undefined,
      description: dto.description === undefined ? undefined : dto.description,
    };
    return prisma.category.update({ where: { id }, data });
  }

  async delete(id: number) {
    return prisma.category.delete({ where: { id } });
  }
}

