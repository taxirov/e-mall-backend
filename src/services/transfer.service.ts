import prisma from "../database";
import { Prisma, TransferStatus } from "@prisma/client";
import { emitToCompany } from "../realtime/socket";
import { AddTransferItemDto, CreateTransferDto } from "../models/transfer.model";

export class TransferService {
  async create(dto: CreateTransferDto) {
    return prisma.$transaction(async (tx) => {
      const transfer = await tx.transfer.create({ data: { fromLocationId: dto.fromLocationId, toLocationId: dto.toLocationId, note: dto.note ?? undefined, status: dto.status ?? TransferStatus.DRAFT } });
      if (dto.items?.length) {
        await tx.transferItem.createMany({ data: dto.items.map((i) => ({ transferId: transfer.id, productId: i.productId, quantity: i.quantity })) });
      }
      const full = await tx.transfer.findUniqueOrThrow({ where: { id: transfer.id }, include: { items: true } });
      // Try to derive companyId from fromLocation or toLocation
      const loc = await tx.inventoryLocation.findUnique({ where: { id: full.fromLocationId }, select: { companyId: true } });
      if (loc?.companyId) emitToCompany(loc.companyId, 'transfer:created', full);
      return full;
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
    const upd = await prisma.transfer.update({ where: { id }, data: { status } });
    const loc = await prisma.inventoryLocation.findUnique({ where: { id: upd.fromLocationId }, select: { companyId: true } });
    if (loc?.companyId) emitToCompany(loc.companyId, 'transfer:status', upd);
    return upd;
  }

  async addItem(transferId: number, dto: AddTransferItemDto) {
    const item = await prisma.transferItem.upsert({
      where: { transferId_productId: { transferId, productId: dto.productId } },
      create: { transferId, productId: dto.productId, quantity: dto.quantity },
      update: { quantity: dto.quantity },
    });
    const tr = await prisma.transfer.findUnique({ where: { id: transferId }, select: { fromLocationId: true } });
    const loc = tr ? await prisma.inventoryLocation.findUnique({ where: { id: tr.fromLocationId }, select: { companyId: true } }) : null;
    if (loc?.companyId) emitToCompany(loc.companyId, 'transfer:item', item);
    return item;
  }

  async removeItem(transferId: number, productId: number) {
    const del = await prisma.transferItem.delete({ where: { transferId_productId: { transferId, productId } } });
    const tr = await prisma.transfer.findUnique({ where: { id: transferId }, select: { fromLocationId: true } });
    const loc = tr ? await prisma.inventoryLocation.findUnique({ where: { id: tr.fromLocationId }, select: { companyId: true } }) : null;
    if (loc?.companyId) emitToCompany(loc.companyId, 'transfer:item:remove', del);
    return del;
  }
}
