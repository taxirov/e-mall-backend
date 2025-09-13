import { Request, Response } from "express";
import { CompanyService, makeCompanyService } from "../services/company.service";
import { CompanyType, Role } from "@prisma/client";

const service: CompanyService = makeCompanyService();

export class CompanyController {
  async create(req: Request, res: Response) {
    try {
      const company = await service.create(req.body);
      res.status(201).json(company);
    } catch (e: any) {
      res.status(400).json({ message: CompanyService.mapPrismaError(e).message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (!id) return res.status(400).json({ message: "id required" });
      const company = await service.getById(id);
      if (!company) return res.status(404).json({ message: "Company not found" });
      res.json(company);
    } catch (e) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async list(req: Request, res: Response) {
    try {
      const { page, pageSize, q, type, isActive, isBranch, parentCompanyId, sortField, sortDirection } = req.query as any;
      const data = await service.list(
        {
          q: q as string | undefined,
          type: type as CompanyType | undefined,
          isActive: typeof isActive === "string" ? isActive === "true" : undefined,
          isBranch: typeof isBranch === "string" ? isBranch === "true" : undefined,
          parentCompanyId: parentCompanyId ? Number(parentCompanyId) : undefined,
        },
        { page: page ? Number(page) : undefined, pageSize: pageSize ? Number(pageSize) : undefined },
        { field: (sortField as any) ?? undefined, direction: (sortDirection as any) ?? undefined }
      );
      res.json(data);
    } catch (e) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (!id) return res.status(400).json({ message: "id required" });
      const company = await service.update(id, req.body);
      res.json(company);
    } catch (e: any) {
      res.status(400).json({ message: CompanyService.mapPrismaError(e).message });
    }
  }

  async softDelete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (!id) return res.status(400).json({ message: "id required" });
      const company = await service.softDelete(id);
      res.json(company);
    } catch (e) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async restore(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (!id) return res.status(400).json({ message: "id required" });
      const company = await service.restore(id);
      res.json(company);
    } catch (e) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async hardDelete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (!id) return res.status(400).json({ message: "id required" });
      const company = await service.hardDelete(id);
      res.json(company);
    } catch (e) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  // Membership
  async addOrUpdateUser(req: Request, res: Response) {
    try {
      const companyId = Number(req.params.companyId);
      const { userId, roles } = req.body as { userId: number; roles: Role[] };
      if (!companyId || !userId || !Array.isArray(roles)) return res.status(400).json({ message: "companyId, userId, roles required" });
      const result = await service.addOrUpdateUser(companyId, Number(userId), roles);
      res.json(result);
    } catch (e) {
      res.status(400).json({ message: CompanyService.mapPrismaError(e).message });
    }
  }

  async removeUser(req: Request, res: Response) {
    try {
      const companyId = Number(req.params.companyId);
      const userId = Number(req.params.userId);
      if (!companyId || !userId) return res.status(400).json({ message: "companyId, userId required" });
      const result = await service.removeUser(companyId, userId);
      res.json(result);
    } catch (e) {
      res.status(400).json({ message: CompanyService.mapPrismaError(e).message });
    }
  }

  async setUserRoles(req: Request, res: Response) {
    try {
      const companyId = Number(req.params.companyId);
      const userId = Number(req.params.userId);
      const { roles } = req.body as { roles: Role[] };
      if (!companyId || !userId || !Array.isArray(roles)) return res.status(400).json({ message: "companyId, userId, roles required" });
      const result = await service.setUserRoles(companyId, userId, roles);
      res.json(result);
    } catch (e) {
      res.status(400).json({ message: CompanyService.mapPrismaError(e).message });
    }
  }

  async addUserRoles(req: Request, res: Response) {
    try {
      const companyId = Number(req.params.companyId);
      const userId = Number(req.params.userId);
      const { roles } = req.body as { roles: Role[] };
      if (!companyId || !userId || !Array.isArray(roles)) return res.status(400).json({ message: "companyId, userId, roles required" });
      const result = await service.addUserRoles(companyId, userId, roles);
      res.json(result);
    } catch (e) {
      res.status(400).json({ message: CompanyService.mapPrismaError(e).message });
    }
  }

  async removeUserRoles(req: Request, res: Response) {
    try {
      const companyId = Number(req.params.companyId);
      const userId = Number(req.params.userId);
      const { roles } = req.body as { roles: Role[] };
      if (!companyId || !userId || !Array.isArray(roles)) return res.status(400).json({ message: "companyId, userId, roles required" });
      const result = await service.removeUserRoles(companyId, userId, roles);
      res.json(result);
    } catch (e) {
      res.status(400).json({ message: CompanyService.mapPrismaError(e).message });
    }
  }

  async listMembers(req: Request, res: Response) {
    try {
      const companyId = Number(req.params.companyId);
      if (!companyId) return res.status(400).json({ message: "companyId required" });
      const result = await service.listMembers(companyId);
      res.json(result);
    } catch (e) {
      res.status(400).json({ message: CompanyService.mapPrismaError(e).message });
    }
  }

  // Category links
  async addCategories(req: Request, res: Response) {
    try {
      const companyId = Number(req.params.companyId);
      const { categoryIds } = req.body as { categoryIds: number[] };
      const result = await service.addCategories(companyId, categoryIds ?? []);
      res.json(result);
    } catch (e) {
      res.status(400).json({ message: CompanyService.mapPrismaError(e).message });
    }
  }

  async removeCategories(req: Request, res: Response) {
    try {
      const companyId = Number(req.params.companyId);
      const { categoryIds } = req.body as { categoryIds: number[] };
      const result = await service.removeCategories(companyId, categoryIds ?? []);
      res.json(result);
    } catch (e) {
      res.status(400).json({ message: CompanyService.mapPrismaError(e).message });
    }
  }

  async setCategories(req: Request, res: Response) {
    try {
      const companyId = Number(req.params.companyId);
      const { categoryIds } = req.body as { categoryIds: number[] };
      const result = await service.setCategories(companyId, categoryIds ?? []);
      res.json(result);
    } catch (e) {
      res.status(400).json({ message: CompanyService.mapPrismaError(e).message });
    }
  }
}
