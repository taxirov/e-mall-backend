import prisma from "../database";
import { Prisma, TransferStatus } from "@prisma/client";
import { AddTransferItemDto, CreateTransferDto } from "../models/transfer.model";

export class TransferService {
  async create(dto: CreateTransferDto) {
    return prisma.$transaction(async (tx) => {
      const transfer = await tx.transfer.create({ data: { fromLocationId: dto.fromLocationId, toLocationId: dto.toLocationId, note: dto.note ?? undefined, status: dto.status ?? TransferStatus.DRAFT } });
      if (dto.items?.length) {
        await tx.transferItem.createMany({ data: dto.items.map((i) => ({ transferId: transfer.id, productId: i.productId, quantity: i.quantity })) });
      }
      return tx.transfer.findUniqueOrThrow({ where: { id: transfer.id }, include: { items: true } });
    });
  }

  async getById(id: number) {
    return prisma.transfer.findUnique({ where: { id }, include: { items: true } });
  }

  async list(params?: { status?: TransferStatus; fromLocationId?: number; toLocationId?: number }) {
    const where: Prisma.TransferWhereInput = {
      AND: [
        params?.status ? { status: params.status } : {},
        params?.fromLocationId ? { fromLocationId: params.fromLocationId } : {},
        params?.toLocationId ? { toLocationId: params.toLocationId } : {},
      ],
    };
    return prisma.transfer.findMany({ where, orderBy: { createdAt: "desc" }, include: { items: true } });
  }

  async setStatus(id: number, status: TransferStatus) {
    return prisma.transfer.update({ where: { id }, data: { status } });
  }

  async addItem(transferId: number, dto: AddTransferItemDto) {
    return prisma.transferItem.upsert({
      where: { transferId_productId: { transferId, productId: dto.productId } },
      create: { transferId, productId: dto.productId, quantity: dto.quantity },
      update: { quantity: dto.quantity },
    });
  }

  async removeItem(transferId: number, productId: number) {
    return prisma.transferItem.delete({ where: { transferId_productId: { transferId, productId } } });
  }
}

