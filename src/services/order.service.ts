import prisma from "../database";
import { OrderStatus, Prisma } from "@prisma/client";
import { AddAssignmentDto, AddOrderItemDto, CreateOrderDto } from "../models/order.model";

export class OrderService {
  async create(dto: CreateOrderDto) {
    return prisma.$transaction(async (tx) => {
      const order = await tx.order.create({ data: { status: dto.status ?? OrderStatus.PENDING } });
      if (dto.items?.length) {
        await tx.productInOrder.createMany({
          data: dto.items.map((i) => ({ orderId: order.id, productId: i.productId, quantity: i.quantity ?? 1, price: i.price as any, productInCompanyId: i.productInCompanyId ?? null })),
        });
      }
      return tx.order.findUniqueOrThrow({ where: { id: order.id }, include: { ProductInOrder: true, assignments: true } });
    });
  }

  async getById(id: number) {
    return prisma.order.findUnique({ where: { id }, include: { ProductInOrder: true, assignments: true } });
  }

  async list(params?: { status?: OrderStatus }) {
    const where: Prisma.OrderWhereInput = params?.status ? { status: params.status } : {};
    return prisma.order.findMany({ where, orderBy: { createdAt: "desc" }, include: { ProductInOrder: true, assignments: true } });
  }

  async setStatus(id: number, status: OrderStatus) {
    return prisma.order.update({ where: { id }, data: { status } });
  }

  async addItem(orderId: number, dto: AddOrderItemDto) {
    return prisma.productInOrder.create({ data: { orderId, productId: dto.productId, quantity: dto.quantity ?? 1, price: dto.price as any, productInCompanyId: dto.productInCompanyId ?? null } });
  }

  async removeItem(orderId: number, productId: number) {
    return prisma.productInOrder.delete({ where: { orderId_productId: { orderId, productId } } });
  }

  async assign(orderId: number, dto: AddAssignmentDto) {
    return prisma.orderAssignment.upsert({
      where: { orderId_userId_role: { orderId, userId: dto.userId, role: dto.role } },
      update: {},
      create: { orderId, userId: dto.userId, role: dto.role },
    });
  }

  async unassign(orderId: number, userId: number, role: string) {
    return prisma.orderAssignment.delete({ where: { orderId_userId_role: { orderId, userId, role: role as any } } });
  }
}

