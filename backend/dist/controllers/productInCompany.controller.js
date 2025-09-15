"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductInCompanyController = void 0;
const productInCompany_service_1 = require("../services/productInCompany.service");
const service = new productInCompany_service_1.ProductInCompanyService();
class ProductInCompanyController {
    async create(req, res) {
        try {
            const item = await service.create(req.body);
            res.status(201).json(item);
        }
        catch (e) {
            res.status(400).json({ message: e.message });
        }
    }
    async getById(req, res) {
        const id = Number(req.params.id);
        if (!id)
            return res.status(400).json({ message: "id required" });
        const item = await service.getById(id);
        if (!item)
            return res.status(404).json({ message: "Not found" });
        res.json(item);
    }
    async list(req, res) {
        const { companyId, productId, categoryId, status, q } = req.query;
        const list = await service.list({
            companyId: companyId ? Number(companyId) : undefined,
            productId: productId ? Number(productId) : undefined,
            categoryId: categoryId ? Number(categoryId) : undefined,
            status: status ?? undefined,
            q: q ?? undefined,
        });
        res.json(list);
    }
    async update(req, res) {
        const id = Number(req.params.id);
        if (!id)
            return res.status(400).json({ message: "id required" });
        const item = await service.update(id, req.body);
        res.json(item);
    }
    async delete(req, res) {
        const id = Number(req.params.id);
        if (!id)
            return res.status(400).json({ message: "id required" });
        const item = await service.delete(id);
        res.json(item);
    }
}
exports.ProductInCompanyController = ProductInCompanyController;
