"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const order_service_1 = require("../services/order.service");
const service = new order_service_1.OrderService();
class OrderController {
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
        const status = req.query.status;
        const list = await service.list({ status });
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
        const orderId = Number(req.params.id);
        if (!orderId)
            return res.status(400).json({ message: "orderId required" });
        const item = await service.addItem(orderId, req.body);
        res.status(201).json(item);
    }
    async removeItem(req, res) {
        const orderId = Number(req.params.id);
        const productId = Number(req.params.productId);
        if (!orderId || !productId)
            return res.status(400).json({ message: "orderId and productId required" });
        const item = await service.removeItem(orderId, productId);
        res.json(item);
    }
    async assign(req, res) {
        const orderId = Number(req.params.id);
        if (!orderId)
            return res.status(400).json({ message: "orderId required" });
        const item = await service.assign(orderId, req.body);
        res.status(201).json(item);
    }
    async unassign(req, res) {
        const orderId = Number(req.params.id);
        const userId = Number(req.params.userId);
        const role = req.params.role;
        if (!orderId || !userId || !role)
            return res.status(400).json({ message: "orderId, userId, role required" });
        const item = await service.unassign(orderId, userId, role);
        res.json(item);
    }
}
exports.OrderController = OrderController;
