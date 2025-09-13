import prisma from "../database";
import { Prisma } from "@prisma/client";
import { CreateInventoryLocationDto, UpdateInventoryLocationDto } from "../models/inventory.model";

export class InventoryService {
  async createLocation(dto: CreateInventoryLocationDto) {
    const data: Prisma.InventoryLocationCreateInput = {
      type: dto.type,
      company: dto.companyId ? { connect: { id: dto.companyId } } : undefined,
      branch: dto.branchId ? { connect: { id: dto.branchId } } : undefined,
      storage: dto.storageId ? { connect: { id: dto.storageId } } : undefined,
    };
    return prisma.inventoryLocation.create({ data });
  }

  async getLocationById(id: number) {
    return prisma.inventoryLocation.findUnique({ where: { id } });
  }

  async listLocations(params?: { type?: string; companyId?: number; branchId?: number; storageId?: number }) {
    const where: Prisma.InventoryLocationWhereInput = {
      AND: [
        params?.type ? ({ type: params.type as any } as Prisma.InventoryLocationWhereInput) : {},
        params?.companyId ? { companyId: params.companyId } : {},
        params?.branchId ? { branchId: params.branchId } : {},
        params?.storageId ? { storageId: params.storageId } : {},
      ],
    };
    return prisma.inventoryLocation.findMany({ where, orderBy: { createdAt: "desc" } });
  }

  async updateLocation(id: number, dto: UpdateInventoryLocationDto) {
    const data: Prisma.InventoryLocationUpdateInput = {
      type: dto.type ?? undefined,
      company: dto.companyId === undefined ? undefined : dto.companyId ? { connect: { id: dto.companyId } } : { disconnect: true },
      branch: dto.branchId === undefined ? undefined : dto.branchId ? { connect: { id: dto.branchId } } : { disconnect: true },
      storage: dto.storageId === undefined ? undefined : dto.storageId ? { connect: { id: dto.storageId } } : { disconnect: true },
    };
    return prisma.inventoryLocation.update({ where: { id }, data });
  }

  async deleteLocation(id: number) {
    return prisma.inventoryLocation.delete({ where: { id } });
  }
}

