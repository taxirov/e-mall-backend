import { Request, Response } from "express";
import { InventoryService } from "../services/inventory.service";

const service = new InventoryService();

export class InventoryController {
  async createLocation(req: Request, res: Response) {
    try {
      const item = await service.createLocation(req.body);
      res.status(201).json(item);
    } catch (e: any) {
      res.status(400).json({ message: e.message });
    }
  }

  async getLocationById(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ message: "id required" });
    const item = await service.getLocationById(id);
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  }

  async listLocations(req: Request, res: Response) {
    const { type, companyId, branchId, storageId } = req.query as any;
    const list = await service.listLocations({
      type: type as string | undefined,
      companyId: companyId ? Number(companyId) : undefined,
      branchId: branchId ? Number(branchId) : undefined,
      storageId: storageId ? Number(storageId) : undefined,
    });
    res.json(list);
  }

  async updateLocation(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ message: "id required" });
    const item = await service.updateLocation(id, req.body);
    res.json(item);
  }

  async deleteLocation(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ message: "id required" });
    const item = await service.deleteLocation(id);
    res.json(item);
  }
}

