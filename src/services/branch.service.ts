import prisma from "../database";
import { Prisma } from "@prisma/client";
import { CreateBranchDto, UpdateBranchDto } from "../models/branch.model";

export class BranchService {
  async create(dto: CreateBranchDto) {
    const data: Prisma.BranchCreateInput = {
      name: dto.name,
      desc: dto.desc ?? undefined,
      address: dto.address,
      mainPhone: dto.mainPhone ?? undefined,
      phones: dto.phones ?? [],
      company: { connect: { id: dto.companyId } },
    };
    return prisma.branch.create({ data });
  }

  async getById(id: number) {
    return prisma.branch.findUnique({ where: { id } });
  }

  async list(params?: { companyId?: number; q?: string }) {
    const where: Prisma.BranchWhereInput = {
      AND: [
        params?.companyId ? { companyId: params.companyId } : {},
        params?.q
          ? { OR: [{ name: { contains: params.q, mode: "insensitive" } }, { mainPhone: { contains: params.q } }] }
          : {},
      ],
    };
    return prisma.branch.findMany({ where, orderBy: { createdAt: "desc" } });
  }

  async update(id: number, dto: UpdateBranchDto) {
    const data: Prisma.BranchUpdateInput = {
      name: dto.name ?? undefined,
      desc: dto.desc === undefined ? undefined : dto.desc,
      address: dto.address === undefined ? undefined : (dto.address as any),
      mainPhone: dto.mainPhone === undefined ? undefined : dto.mainPhone,
      phones: dto.phones === undefined ? undefined : dto.phones,
      company: dto.companyId === undefined ? undefined : { connect: { id: dto.companyId } },
    };
    return prisma.branch.update({ where: { id }, data });
  }

  async delete(id: number) {
    return prisma.branch.delete({ where: { id } });
  }
}

