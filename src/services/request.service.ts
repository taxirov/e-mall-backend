import prisma from "../database";
import { Prisma, RequestStatus, Role } from "@prisma/client";
import { CreateRequestDto } from "../models/request.model";
import { NotificationService } from "./notification.service";
import { emitToCompany, emitToUser } from "../realtime/socket";

export class RequestService {
  private notifications = new NotificationService();

  /**
   * Create a request to add a user into a company by roles and salary.
   * Target can be resolved by userId or nickname/phone. Sends notification to target user.
   */
  async create(dto: CreateRequestDto) {
    // resolve target user
    let targetUserId = dto.targetUserId;
    if (!targetUserId && dto.targetNicknameOrPhone) {
      const target = await prisma.user.findFirst({
        where: {
          OR: [
            { nickname: dto.targetNicknameOrPhone },
            { phone: dto.targetNicknameOrPhone },
          ],
        },
        select: { id: true },
      });
      if (!target) throw new Error("Target user not found by nickname or phone");
      targetUserId = target.id;
    }
    if (!targetUserId) throw new Error("targetUserId or targetNicknameOrPhone required");

    // avoid duplicate active requests
    const existing = await prisma.request.findFirst({
      where: { targetUserId, companyId: dto.companyId, status: { in: [RequestStatus.PENDING, RequestStatus.IN_PROGRESS] } },
      select: { id: true },
    });
    if (existing) throw new Error("Active request already exists for this user and company");

    const created = await prisma.request.create({
      data: {
        requesterId: dto.requesterId,
        targetUserId,
        companyId: dto.companyId,
        roles: Array.from(new Set(dto.roles ?? [])),
        salary: dto.salary ?? null,
        message: dto.message ?? undefined,
        status: RequestStatus.PENDING,
      },
    });

    // notify target
    await this.notifications.create(
      targetUserId,
      "Ishga taklif",
      `Siz ${dto.companyId} kompaniyasiga taklif qilindingiz`,
      { companyId: dto.companyId, requestId: created.id, roles: created.roles, salary: created.salary },
      created.id
    );

    return created;
  }

  async getById(id: number) {
    return prisma.request.findUnique({ where: { id } });
  }

  async listIncoming(userId: number) {
    return prisma.request.findMany({ where: { targetUserId: userId }, orderBy: { createdAt: "desc" } });
  }

  async listOutgoing(userId: number) {
    return prisma.request.findMany({ where: { requesterId: userId }, orderBy: { createdAt: "desc" } });
  }

  async setStatus(id: number, status: RequestStatus) {
    return prisma.request.update({ where: { id }, data: { status, respondedAt: status === RequestStatus.CONFIRMED || status === RequestStatus.CANCELLED ? new Date() : undefined } });
  }

  /** Accept a request: add or update membership (UserInCompany) then set status CONFIRMED. Notify requester. */
  async accept(id: number) {
    const req = await prisma.request.findUnique({ where: { id } });
    if (!req) throw new Error("Request not found");
    if (req.status !== RequestStatus.PENDING && req.status !== RequestStatus.IN_PROGRESS) throw new Error("Request is not pending");

    const membership = await prisma.userInCompany.upsert({
      where: { userId_companyId: { userId: req.targetUserId, companyId: req.companyId } },
      update: { roles: Array.from(new Set(req.roles as Role[])) },
      create: { userId: req.targetUserId, companyId: req.companyId, roles: Array.from(new Set(req.roles as Role[])) },
    });

    if (req.salary != null) {
      await prisma.user.update({ where: { id: req.targetUserId }, data: { salary: req.salary } });
    }

    const updated = await prisma.request.update({ where: { id }, data: { status: RequestStatus.CONFIRMED, respondedAt: new Date() } });

    // notify requester
    await this.notifications.create(
      req.requesterId,
      "So'rov qabul qilindi",
      `Foydalanuvchi kompaniyangizga qo'shilishni qabul qildi`,
      { requestId: req.id, companyId: req.companyId, userId: req.targetUserId }
    );

    emitToUser(req.targetUserId, 'request:updated', updated);
    emitToUser(req.requesterId, 'request:updated', updated);
    emitToCompany(req.companyId, 'company:member:updated', { userId: req.targetUserId, roles: membership.roles });
    return { updated, membership };
  }

  /** Decline/cancel */
  async decline(id: number) {
    const req = await prisma.request.findUnique({ where: { id } });
    if (!req) throw new Error("Request not found");
    if (req.status !== RequestStatus.PENDING && req.status !== RequestStatus.IN_PROGRESS) throw new Error("Request is not pending");
    const updated = await prisma.request.update({ where: { id }, data: { status: RequestStatus.CANCELLED, respondedAt: new Date() } });
    // notify requester
    await this.notifications.create(
      req.requesterId,
      "So'rov rad etildi",
      `Foydalanuvchi so'rovni rad etdi`,
      { requestId: req.id, companyId: req.companyId, userId: req.targetUserId }
    );
    emitToUser(req.targetUserId, 'request:updated', updated);
    emitToUser(req.requesterId, 'request:updated', updated);
    return updated;
  }
}
