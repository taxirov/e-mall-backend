import prisma from "../database";
import { Prisma } from "@prisma/client";

export class NotificationService {
  async create(userId: number, title: string, body?: string | null, data?: Prisma.InputJsonValue, requestId?: number | null) {
    return prisma.notification.create({ data: { userId, title, body: body ?? undefined, data, requestId: requestId ?? undefined } });
  }

  async list(userId: number, params?: { unreadOnly?: boolean }) {
    const where: Prisma.NotificationWhereInput = {
      userId,
      ...(params?.unreadOnly ? { readAt: null } : {}),
    };
    return prisma.notification.findMany({ where, orderBy: { createdAt: "desc" } });
  }

  async markRead(id: number) {
    return prisma.notification.update({ where: { id }, data: { readAt: new Date() } });
  }

  async markAllRead(userId: number) {
    return prisma.notification.updateMany({ where: { userId, readAt: null }, data: { readAt: new Date() } });
  }
}

