import { Server } from "socket.io";
import type { Server as HttpServer } from "http";
import jwt from "jsonwebtoken";
import prisma from "../database";

let io: Server | null = null;

export function initSocket(server: HttpServer) {
  io = new Server(server, {
    cors: { origin: '*', credentials: true },
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.toString()?.replace(/^Bearer\s+/i, "");
      if (!token) return next(); // allow anonymous, limited functionality
      const payload = jwt.verify(token, process.env.SECRET_KEY! ) as { nickname?: string; phone?: string };
      if (!payload?.nickname && !payload?.phone) return next(new Error('Invalid token payload'));
      const user = await prisma.user.findFirst({ where: { OR: [{ nickname: payload.nickname ?? "__" }, { phone: payload.phone ?? "__" }] }, select: { id: true } });
      if (user) {
        (socket as any).userId = user.id;
      }
      next();
    } catch (e) {
      next();
    }
  });

  io.on('connection', (socket) => {
    const userId = (socket as any).userId as number | undefined;
    if (userId) {
      socket.join(`user:${userId}`);
    }

    socket.on('join:company', (companyId: number) => {
      if (companyId) socket.join(`company:${companyId}`);
    });
    socket.on('leave:company', (companyId: number) => {
      if (companyId) socket.leave(`company:${companyId}`);
    });
    socket.on('join:order', (orderId: number) => {
      if (orderId) socket.join(`order:${orderId}`);
    });
    socket.on('leave:order', (orderId: number) => {
      if (orderId) socket.leave(`order:${orderId}`);
    });
  });

  return io;
}

function getIO(): Server {
  if (!io) throw new Error('Socket.IO not initialized');
  return io;
}

export function emitToUser(userId: number, event: string, data: any) {
  if (!io) return; io.to(`user:${userId}`).emit(event, data);
}

export function emitToCompany(companyId: number, event: string, data: any) {
  if (!io) return; io.to(`company:${companyId}`).emit(event, data);
}

export function emitToOrder(orderId: number, event: string, data: any) {
  if (!io) return; io.to(`order:${orderId}`).emit(event, data);
}

export function emitAll(event: string, data: any) {
  if (!io) return; io.emit(event, data);
}

