import prisma from "../database";
import { Prisma } from "@prisma/client";
import { CreateStockDto, UpdateStockDto } from "../models/stock.model";
import { emitToCompany } from "../realtime/socket";
import prismaClient from "../database";

export class StockService {
  async upsert(dto: CreateStockDto) {
    const result = await prisma.stock.upsert({
      where: { locationId_productId: { locationId: dto.locationId, productId: dto.productId } },
      create: { locationId: dto.locationId, productId: dto.productId, quantity: dto.quantity ?? 0 },
      update: { quantity: dto.quantity ?? 0 },
    });
    const loc = await prismaClient.inventoryLocation.findUnique({ where: { id: result.locationId }, select: { companyId: true } });
    if (loc?.companyId) emitToCompany(loc.companyId, 'stock:updated', result);
    return result;
  }

  async get(locationId: number, productId: number) {
    return prisma.stock.findUnique({ where: { locationId_productId: { locationId, productId } } });
  }

  async list(params?: { locationId?: number; productId?: number }) {
    const where: Prisma.StockWhereInput = {
      AND: [
        params?.locationId ? { locationId: params.locationId } : {},
        params?.productId ? { productId: params.productId } : {},
      ],
    };
    return prisma.stock.findMany({ where, orderBy: { id: "desc" } });
  }

  async update(locationId: number, productId: number, dto: UpdateStockDto) {
    const data: Prisma.StockUpdateInput = {
      quantity: dto.quantity === undefined ? undefined : dto.quantity,
      location: dto.locationId === undefined ? undefined : { connect: { id: dto.locationId } },
      product: dto.productId === undefined ? undefined : { connect: { id: dto.productId } },
    };
    const updated = await prisma.stock.update({ where: { locationId_productId: { locationId, productId } }, data });
    const loc = await prismaClient.inventoryLocation.findUnique({ where: { id: updated.locationId }, select: { companyId: true } });
    if (loc?.companyId) emitToCompany(loc.companyId, 'stock:updated', updated);
    return updated;
  }

  async delete(locationId: number, productId: number) {
    const deleted = await prisma.stock.delete({ where: { locationId_productId: { locationId, productId } } });
    const loc = await prismaClient.inventoryLocation.findUnique({ where: { id: deleted.locationId }, select: { companyId: true } });
    if (loc?.companyId) emitToCompany(loc.companyId, 'stock:deleted', deleted);
    return deleted;
  }
}
