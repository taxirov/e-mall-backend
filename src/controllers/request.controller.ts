import { Request, Response } from "express";
import { RequestService } from "../services/request.service";

const service = new RequestService();

export class CompanyRequestController {
  async create(req: Request, res: Response) {
    try {
      const created = await service.create(req.body);
      res.status(201).json(created);
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

  async incoming(req: Request, res: Response) {
    const userId = Number(req.params.userId);
    if (!userId) return res.status(400).json({ message: "userId required" });
    const list = await service.listIncoming(userId);
    res.json(list);
  }

  async outgoing(req: Request, res: Response) {
    const userId = Number(req.params.userId);
    if (!userId) return res.status(400).json({ message: "userId required" });
    const list = await service.listOutgoing(userId);
    res.json(list);
  }

  async accept(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ message: "id required" });
    const result = await service.accept(id);
    res.json(result);
  }

  async decline(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ message: "id required" });
    const result = await service.decline(id);
    res.json(result);
  }
}

