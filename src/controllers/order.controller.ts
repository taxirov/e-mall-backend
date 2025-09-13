import { Request, Response } from "express";
import { OrderService } from "../services/order.service";
import { OrderStatus } from "@prisma/client";

const service = new OrderService();

export class OrderController {
  async create(req: Request, res: Response) {
    try {
      const item = await service.create(req.body);
      res.status(201).json(item);
    } catch (e: any) {
      res.status(400).json({ message: e.message });
    }
  }

  async getById(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ message: "id required" });
    const item = await service.getById(id);
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  }

  async list(req: Request, res: Response) {
    const status = req.query.status as OrderStatus | undefined;
    const list = await service.list({ status });
    res.json(list);
  }

  async setStatus(req: Request, res: Response) {
    const id = Number(req.params.id);
    const { status } = req.body as { status: OrderStatus };
    if (!id || !status) return res.status(400).json({ message: "id and status required" });
    const item = await service.setStatus(id, status);
    res.json(item);
  }

  async addItem(req: Request, res: Response) {
    const orderId = Number(req.params.id);
    if (!orderId) return res.status(400).json({ message: "orderId required" });
    const item = await service.addItem(orderId, req.body);
    res.status(201).json(item);
  }

  async removeItem(req: Request, res: Response) {
    const orderId = Number(req.params.id);
    const productId = Number(req.params.productId);
    if (!orderId || !productId) return res.status(400).json({ message: "orderId and productId required" });
    const item = await service.removeItem(orderId, productId);
    res.json(item);
  }

  async assign(req: Request, res: Response) {
    const orderId = Number(req.params.id);
    if (!orderId) return res.status(400).json({ message: "orderId required" });
    const item = await service.assign(orderId, req.body);
    res.status(201).json(item);
  }

  async unassign(req: Request, res: Response) {
    const orderId = Number(req.params.id);
    const userId = Number(req.params.userId);
    const role = req.params.role as string;
    if (!orderId || !userId || !role) return res.status(400).json({ message: "orderId, userId, role required" });
    const item = await service.unassign(orderId, userId, role);
    res.json(item);
  }
}

