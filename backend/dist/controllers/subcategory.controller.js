"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubCategoryController = void 0;
const subcategory_service_1 = require("../services/subcategory.service");
const service = new subcategory_service_1.SubCategoryService();
class SubCategoryController {
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
        const list = await service.list({ q, categoryId });
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
exports.SubCategoryController = SubCategoryController;
