import { Request, Response } from "express";
import { TransferService } from "../services/transfer.service";
import { TransferStatus } from "@prisma/client";

const service = new TransferService();

export class TransferController {
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
    const { status, fromLocationId, toLocationId } = req.query as any;
    const list = await service.list({ status: status as TransferStatus | undefined, fromLocationId: fromLocationId ? Number(fromLocationId) : undefined, toLocationId: toLocationId ? Number(toLocationId) : undefined });
    res.json(list);
  }

  async setStatus(req: Request, res: Response) {
    const id = Number(req.params.id);
    const { status } = req.body as { status: TransferStatus };
    if (!id || !status) return res.status(400).json({ message: "id and status required" });
    const item = await service.setStatus(id, status);
    res.json(item);
  }

  async addItem(req: Request, res: Response) {
    const transferId = Number(req.params.id);
    if (!transferId) return res.status(400).json({ message: "transferId required" });
    const item = await service.addItem(transferId, req.body);
    res.status(201).json(item);
  }

  async removeItem(req: Request, res: Response) {
    const transferId = Number(req.params.id);
    const productId = Number(req.params.productId);
    if (!transferId || !productId) return res.status(400).json({ message: "transferId and productId required" });
    const item = await service.removeItem(transferId, productId);
    res.json(item);
  }
}

