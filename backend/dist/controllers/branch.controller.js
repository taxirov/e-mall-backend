"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BranchController = void 0;
const branch_service_1 = require("../services/branch.service");
const service = new branch_service_1.BranchService();
class BranchController {
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
        const companyId = req.query.companyId ? Number(req.query.companyId) : undefined;
        const q = req.query.q ?? undefined;
        const list = await service.list({ companyId, q });
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
exports.BranchController = BranchController;
