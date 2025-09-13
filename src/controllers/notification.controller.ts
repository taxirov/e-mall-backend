import { Request, Response } from "express";
import { NotificationService } from "../services/notification.service";

const service = new NotificationService();

export class NotificationController {
  async list(req: Request, res: Response) {
    const userId = Number(req.params.userId);
    const unreadOnly = req.query.unreadOnly === "true";
    if (!userId) return res.status(400).json({ message: "userId required" });
    const list = await service.list(userId, { unreadOnly });
    res.json(list);
  }

  async markRead(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ message: "id required" });
    const item = await service.markRead(id);
    res.json(item);
  }

  async markAllRead(req: Request, res: Response) {
    const userId = Number(req.params.userId);
    if (!userId) return res.status(400).json({ message: "userId required" });
    const result = await service.markAllRead(userId);
    res.json(result);
  }
}

