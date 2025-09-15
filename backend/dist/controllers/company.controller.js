"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyController = void 0;
const company_service_1 = require("../services/company.service");
const database_1 = __importDefault(require("../database"));
const service = (0, company_service_1.makeCompanyService)();
class CompanyController {
    async create(req, res) {
        try {
            // Identify current user from JWT payload (nickname or phone)
            let createdByUserId = null;
            const payload = res.locals?.payload;
            if (payload?.nickname) {
                const u = await database_1.default.user.findUnique({ where: { nickname: payload.nickname }, select: { id: true } });
                if (u)
                    createdByUserId = u.id;
            }
            else if (payload?.phone) {
                const u = await database_1.default.user.findUnique({ where: { phone: payload.phone }, select: { id: true } });
                if (u)
                    createdByUserId = u.id;
            }
            const company = createdByUserId
                ? await service.createByUser(createdByUserId, req.body)
                : await service.create(req.body);
            res.status(201).json(company);
        }
        catch (e) {
            res.status(400).json({ message: company_service_1.CompanyService.mapPrismaError(e).message });
        }
    }
    async getById(req, res) {
        try {
            const id = Number(req.params.id);
            if (!id)
                return res.status(400).json({ message: "id required" });
            const company = await service.getById(id);
            if (!company)
                return res.status(404).json({ message: "Company not found" });
            res.json(company);
        }
        catch (e) {
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
    async list(req, res) {
        try {
            const { page, pageSize, q, type, isActive, isBranch, parentCompanyId, sortField, sortDirection } = req.query;
            const data = await service.list({
                q: q,
                type: type,
                isActive: typeof isActive === "string" ? isActive === "true" : undefined,
                isBranch: typeof isBranch === "string" ? isBranch === "true" : undefined,
                parentCompanyId: parentCompanyId ? Number(parentCompanyId) : undefined,
            }, { page: page ? Number(page) : undefined, pageSize: pageSize ? Number(pageSize) : undefined }, { field: sortField ?? undefined, direction: sortDirection ?? undefined });
            res.json(data);
        }
        catch (e) {
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
    async update(req, res) {
        try {
            const id = Number(req.params.id);
            if (!id)
                return res.status(400).json({ message: "id required" });
            const company = await service.update(id, req.body);
            res.json(company);
        }
        catch (e) {
            res.status(400).json({ message: company_service_1.CompanyService.mapPrismaError(e).message });
        }
    }
    async softDelete(req, res) {
        try {
            const id = Number(req.params.id);
            if (!id)
                return res.status(400).json({ message: "id required" });
            const company = await service.softDelete(id);
            res.json(company);
        }
        catch (e) {
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
    async restore(req, res) {
        try {
            const id = Number(req.params.id);
            if (!id)
                return res.status(400).json({ message: "id required" });
            const company = await service.restore(id);
            res.json(company);
        }
        catch (e) {
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
    async hardDelete(req, res) {
        try {
            const id = Number(req.params.id);
            if (!id)
                return res.status(400).json({ message: "id required" });
            const company = await service.hardDelete(id);
            res.json(company);
        }
        catch (e) {
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
    // Membership
    async addOrUpdateUser(req, res) {
        try {
            const companyId = Number(req.params.companyId);
            const { userId, roles } = req.body;
            if (!companyId || !userId || !Array.isArray(roles))
                return res.status(400).json({ message: "companyId, userId, roles required" });
            const result = await service.addOrUpdateUser(companyId, Number(userId), roles);
            res.json(result);
        }
        catch (e) {
            res.status(400).json({ message: company_service_1.CompanyService.mapPrismaError(e).message });
        }
    }
    async removeUser(req, res) {
        try {
            const companyId = Number(req.params.companyId);
            const userId = Number(req.params.userId);
            if (!companyId || !userId)
                return res.status(400).json({ message: "companyId, userId required" });
            const result = await service.removeUser(companyId, userId);
            res.json(result);
        }
        catch (e) {
            res.status(400).json({ message: company_service_1.CompanyService.mapPrismaError(e).message });
        }
    }
    async setUserRoles(req, res) {
        try {
            const companyId = Number(req.params.companyId);
            const userId = Number(req.params.userId);
            const { roles } = req.body;
            if (!companyId || !userId || !Array.isArray(roles))
                return res.status(400).json({ message: "companyId, userId, roles required" });
            const result = await service.setUserRoles(companyId, userId, roles);
            res.json(result);
        }
        catch (e) {
            res.status(400).json({ message: company_service_1.CompanyService.mapPrismaError(e).message });
        }
    }
    async addUserRoles(req, res) {
        try {
            const companyId = Number(req.params.companyId);
            const userId = Number(req.params.userId);
            const { roles } = req.body;
            if (!companyId || !userId || !Array.isArray(roles))
                return res.status(400).json({ message: "companyId, userId, roles required" });
            const result = await service.addUserRoles(companyId, userId, roles);
            res.json(result);
        }
        catch (e) {
            res.status(400).json({ message: company_service_1.CompanyService.mapPrismaError(e).message });
        }
    }
    async removeUserRoles(req, res) {
        try {
            const companyId = Number(req.params.companyId);
            const userId = Number(req.params.userId);
            const { roles } = req.body;
            if (!companyId || !userId || !Array.isArray(roles))
                return res.status(400).json({ message: "companyId, userId, roles required" });
            const result = await service.removeUserRoles(companyId, userId, roles);
            res.json(result);
        }
        catch (e) {
            res.status(400).json({ message: company_service_1.CompanyService.mapPrismaError(e).message });
        }
    }
    async listMembers(req, res) {
        try {
            const companyId = Number(req.params.companyId);
            if (!companyId)
                return res.status(400).json({ message: "companyId required" });
            const result = await service.listMembers(companyId);
            res.json(result);
        }
        catch (e) {
            res.status(400).json({ message: company_service_1.CompanyService.mapPrismaError(e).message });
        }
    }
    // Category links
    async addCategories(req, res) {
        try {
            const companyId = Number(req.params.companyId);
            const { categoryIds } = req.body;
            const result = await service.addCategories(companyId, categoryIds ?? []);
            res.json(result);
        }
        catch (e) {
            res.status(400).json({ message: company_service_1.CompanyService.mapPrismaError(e).message });
        }
    }
    async removeCategories(req, res) {
        try {
            const companyId = Number(req.params.companyId);
            const { categoryIds } = req.body;
            const result = await service.removeCategories(companyId, categoryIds ?? []);
            res.json(result);
        }
        catch (e) {
            res.status(400).json({ message: company_service_1.CompanyService.mapPrismaError(e).message });
        }
    }
    async setCategories(req, res) {
        try {
            const companyId = Number(req.params.companyId);
            const { categoryIds } = req.body;
            const result = await service.setCategories(companyId, categoryIds ?? []);
            res.json(result);
        }
        catch (e) {
            res.status(400).json({ message: company_service_1.CompanyService.mapPrismaError(e).message });
        }
    }
}
exports.CompanyController = CompanyController;
