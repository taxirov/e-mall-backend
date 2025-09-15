"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const product_service_1 = require("../services/product.service");
const service = new product_service_1.ProductService();
class ProductController {
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
        const q = req.query.q ?? undefined;
        const categoryId = req.query.categoryId ? Number(req.query.categoryId) : undefined;
        const subCategoryId = req.query.subCategoryId ? Number(req.query.subCategoryId) : undefined;
        const companyId = req.query.companyId ? Number(req.query.companyId) : undefined;
        const list = await service.list({ q, categoryId, subCategoryId, companyId });
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
exports.ProductController = ProductController;
