"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyRequestController = void 0;
const request_service_1 = require("../services/request.service");
const service = new request_service_1.RequestService();
class CompanyRequestController {
    async create(req, res) {
        try {
            const created = await service.create(req.body);
            res.status(201).json(created);
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
    async incoming(req, res) {
        const userId = Number(req.params.userId);
        if (!userId)
            return res.status(400).json({ message: "userId required" });
        const list = await service.listIncoming(userId);
        res.json(list);
    }
    async outgoing(req, res) {
        const userId = Number(req.params.userId);
        if (!userId)
            return res.status(400).json({ message: "userId required" });
        const list = await service.listOutgoing(userId);
        res.json(list);
    }
    async accept(req, res) {
        const id = Number(req.params.id);
        if (!id)
            return res.status(400).json({ message: "id required" });
        const result = await service.accept(id);
        res.json(result);
    }
    async decline(req, res) {
        const id = Number(req.params.id);
        if (!id)
            return res.status(400).json({ message: "id required" });
        const result = await service.decline(id);
        res.json(result);
    }
}
exports.CompanyRequestController = CompanyRequestController;
