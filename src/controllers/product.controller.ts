import { Request, Response } from "express";
import { ProductService } from "../services/product.service";

const service = new ProductService();

export class ProductController {
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
    const categoryId = req.query.categoryId ? Number(req.query.categoryId) : undefined;
    const subCategoryId = req.query.subCategoryId ? Number(req.query.subCategoryId) : undefined;
    const companyId = req.query.companyId ? Number(req.query.companyId) : undefined;
    const list = await service.list({ q, categoryId, subCategoryId, companyId });
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

