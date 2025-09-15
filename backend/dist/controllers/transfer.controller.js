"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransferController = void 0;
const transfer_service_1 = require("../services/transfer.service");
const service = new transfer_service_1.TransferService();
class TransferController {
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
        const { status, fromLocationId, toLocationId } = req.query;
        const list = await service.list({ status: status, fromLocationId: fromLocationId ? Number(fromLocationId) : undefined, toLocationId: toLocationId ? Number(toLocationId) : undefined });
        res.json(list);
    }
    async setStatus(req, res) {
        const id = Number(req.params.id);
        const { status } = req.body;
        if (!id || !status)
            return res.status(400).json({ message: "id and status required" });
        const item = await service.setStatus(id, status);
        res.json(item);
    }
    async addItem(req, res) {
        const transferId = Number(req.params.id);
        if (!transferId)
            return res.status(400).json({ message: "transferId required" });
        const item = await service.addItem(transferId, req.body);
        res.status(201).json(item);
    }
    async removeItem(req, res) {
        const transferId = Number(req.params.id);
        const productId = Number(req.params.productId);
        if (!transferId || !productId)
            return res.status(400).json({ message: "transferId and productId required" });
        const item = await service.removeItem(transferId, productId);
        res.json(item);
    }
}
exports.TransferController = TransferController;
