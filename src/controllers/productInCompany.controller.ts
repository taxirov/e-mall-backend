import { Request, Response } from "express";
import { ProductInCompanyService } from "../services/productInCompany.service";

const service = new ProductInCompanyService();

export class ProductInCompanyController {
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
    const { companyId, productId, categoryId, status, q } = req.query as any;
    const list = await service.list({
      companyId: companyId ? Number(companyId) : undefined,
      productId: productId ? Number(productId) : undefined,
      categoryId: categoryId ? Number(categoryId) : undefined,
      status: (status as string) ?? undefined,
      q: (q as string) ?? undefined,
    });
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

