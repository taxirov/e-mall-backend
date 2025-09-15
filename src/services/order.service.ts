import prisma from "../database";
import { OrderStatus, Prisma } from "@prisma/client";
import { emitToOrder } from "../realtime/socket";
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
      const full = await tx.order.findUniqueOrThrow({ where: { id: order.id }, include: { ProductInOrder: true, assignments: true } });
      emitToOrder(full.id, 'order:created', full);
      return full;
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
    const upd = await prisma.order.update({ where: { id }, data: { status } });
    emitToOrder(id, 'order:status', upd);
    return upd;
  }

  async addItem(orderId: number, dto: AddOrderItemDto) {
    const item = await prisma.productInOrder.create({ data: { orderId, productId: dto.productId, quantity: dto.quantity ?? 1, price: dto.price as any, productInCompanyId: dto.productInCompanyId ?? null } });
    emitToOrder(orderId, 'order:item:add', item);
    return item;
  }

  async removeItem(orderId: number, productId: number) {
    const del = await prisma.productInOrder.delete({ where: { orderId_productId: { orderId, productId } } });
    emitToOrder(orderId, 'order:item:remove', del);
    return del;
  }

  async assign(orderId: number, dto: AddAssignmentDto) {
    const assign = await prisma.orderAssignment.upsert({
      where: { orderId_userId_role: { orderId, userId: dto.userId, role: dto.role } },
      update: {},
      create: { orderId, userId: dto.userId, role: dto.role },
    });
    emitToOrder(orderId, 'order:assign', assign);
    return assign;
  }

  async unassign(orderId: number, userId: number, role: string) {
    const un = await prisma.orderAssignment.delete({ where: { orderId_userId_role: { orderId, userId, role: role as any } } });
    emitToOrder(orderId, 'order:unassign', un);
    return un;
  }
}
