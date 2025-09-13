import prisma from "../database";
import { Prisma } from "@prisma/client";
import { CreateStockDto, UpdateStockDto } from "../models/stock.model";

export class StockService {
  async upsert(dto: CreateStockDto) {
    return prisma.stock.upsert({
      where: { locationId_productId: { locationId: dto.locationId, productId: dto.productId } },
      create: { locationId: dto.locationId, productId: dto.productId, quantity: dto.quantity ?? 0 },
      update: { quantity: dto.quantity ?? 0 },
    });
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
    return prisma.stock.update({ where: { locationId_productId: { locationId, productId } }, data });
  }

  async delete(locationId: number, productId: number) {
    return prisma.stock.delete({ where: { locationId_productId: { locationId, productId } } });
  }
}

