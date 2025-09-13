import { Request, Response } from "express";
import { CompanyOnStorageService } from "../services/companyOnStorage.service";

const service = new CompanyOnStorageService();

export class CompanyOnStorageController {
  async link(req: Request, res: Response) {
    try {
      const item = await service.link(req.body);
      res.status(201).json(item);
    } catch (e: any) {
      res.status(400).json({ message: e.message });
    }
  }

  async unlink(req: Request, res: Response) {
    const companyId = Number(req.params.companyId);
    const storageId = Number(req.params.storageId);
    if (!companyId || !storageId) return res.status(400).json({ message: "companyId and storageId required" });
    const item = await service.unlink(companyId, storageId);
    res.json(item);
  }

  async listStorages(req: Request, res: Response) {
    const companyId = Number(req.params.companyId);
    if (!companyId) return res.status(400).json({ message: "companyId required" });
    const list = await service.listStorages(companyId);
    res.json(list);
  }

  async listCompanies(req: Request, res: Response) {
    const storageId = Number(req.params.storageId);
    if (!storageId) return res.status(400).json({ message: "storageId required" });
    const list = await service.listCompanies(storageId);
    res.json(list);
  }

  async setPrimary(req: Request, res: Response) {
    const companyId = Number(req.params.companyId);
    const storageId = Number(req.params.storageId);
    const { isPrimary } = req.body as { isPrimary: boolean };
    if (!companyId || !storageId || typeof isPrimary !== "boolean") return res.status(400).json({ message: "companyId, storageId, isPrimary required" });
    const item = await service.setPrimary(companyId, storageId, isPrimary);
    res.json(item);
  }
}

