"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockController = void 0;
const stock_service_1 = require("../services/stock.service");
const service = new stock_service_1.StockService();
class StockController {
    async upsert(req, res) {
        try {
            const item = await service.upsert(req.body);
            res.status(201).json(item);
        }
        catch (e) {
            res.status(400).json({ message: e.message });
        }
    }
    async get(req, res) {
        const locationId = Number(req.query.locationId);
        const productId = Number(req.query.productId);
        if (!locationId || !productId)
            return res.status(400).json({ message: "locationId and productId required" });
        const item = await service.get(locationId, productId);
        if (!item)
            return res.status(404).json({ message: "Not found" });
        res.json(item);
    }
    async list(req, res) {
        const locationId = req.query.locationId ? Number(req.query.locationId) : undefined;
        const productId = req.query.productId ? Number(req.query.productId) : undefined;
        const list = await service.list({ locationId, productId });
        res.json(list);
    }
    async update(req, res) {
        const locationId = Number(req.params.locationId);
        const productId = Number(req.params.productId);
        if (!locationId || !productId)
            return res.status(400).json({ message: "locationId and productId required" });
        const item = await service.update(locationId, productId, req.body);
        res.json(item);
    }
    async delete(req, res) {
        const locationId = Number(req.params.locationId);
        const productId = Number(req.params.productId);
        if (!locationId || !productId)
            return res.status(400).json({ message: "locationId and productId required" });
        const item = await service.delete(locationId, productId);
        res.json(item);
    }
}
exports.StockController = StockController;
