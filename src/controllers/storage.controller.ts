import { Request, Response } from "express";
import { StorageService } from "../services/storage.service";

const service = new StorageService();

export class StorageController {
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
    const q = (req.query.q as string) ?? undefined;
    const list = await service.list(q);
    res.json(list);
  }

  async update(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ message: "id required" });
    const item = await service.update(id, req.body);
    res.json(item);
  }

  async delete(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ message: "id required" });
    const item = await service.delete(id);
    res.json(item);
  }
}

