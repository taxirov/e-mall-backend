"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryController = void 0;
const category_service_1 = require("../services/category.service");
const service = new category_service_1.CategoryService();
class CategoryController {
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
        const list = await service.list(q);
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
exports.CategoryController = CategoryController;
