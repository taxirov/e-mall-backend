import prisma from "../database";
import { Prisma } from "@prisma/client";
import { CreateStorageDto, UpdateStorageDto } from "../models/storage.model";

export class StorageService {
  async create(dto: CreateStorageDto) {
    const data: Prisma.StorageCreateInput = {
      name: dto.name,
      desc: dto.desc ?? undefined,
      address: dto.address,
      mainPhone: dto.mainPhone ?? undefined,
      phones: dto.phones ?? [],
    };
    return prisma.storage.create({ data });
  }

  async getById(id: number) {
    return prisma.storage.findUnique({ where: { id } });
  }

  async list(q?: string) {
    const where: Prisma.StorageWhereInput = q
      ? { OR: [{ name: { contains: q, mode: "insensitive" } }, { mainPhone: { contains: q } }] }
      : {};
    return prisma.storage.findMany({ where, orderBy: { createdAt: "desc" } });
  }

  async update(id: number, dto: UpdateStorageDto) {
    const data: Prisma.StorageUpdateInput = {
      name: dto.name ?? undefined,
      desc: dto.desc === undefined ? undefined : dto.desc,
      address: dto.address === undefined ? undefined : (dto.address as any),
      mainPhone: dto.mainPhone === undefined ? undefined : dto.mainPhone,
      phones: dto.phones === undefined ? undefined : dto.phones,
    };
    return prisma.storage.update({ where: { id }, data });
  }

  async delete(id: number) {
    return prisma.storage.delete({ where: { id } });
  }
}

