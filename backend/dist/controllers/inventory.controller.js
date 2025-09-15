"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryController = void 0;
const inventory_service_1 = require("../services/inventory.service");
const service = new inventory_service_1.InventoryService();
class InventoryController {
    async createLocation(req, res) {
        try {
            const item = await service.createLocation(req.body);
            res.status(201).json(item);
        }
        catch (e) {
            res.status(400).json({ message: e.message });
        }
    }
    async getLocationById(req, res) {
        const id = Number(req.params.id);
        if (!id)
            return res.status(400).json({ message: "id required" });
        const item = await service.getLocationById(id);
        if (!item)
            return res.status(404).json({ message: "Not found" });
        res.json(item);
    }
    async listLocations(req, res) {
        const { type, companyId, branchId, storageId } = req.query;
        const list = await service.listLocations({
            type: type,
            companyId: companyId ? Number(companyId) : undefined,
            branchId: branchId ? Number(branchId) : undefined,
            storageId: storageId ? Number(storageId) : undefined,
        });
        res.json(list);
    }
    async updateLocation(req, res) {
        const id = Number(req.params.id);
        if (!id)
            return res.status(400).json({ message: "id required" });
        const item = await service.updateLocation(id, req.body);
        res.json(item);
    }
    async deleteLocation(req, res) {
        const id = Number(req.params.id);
        if (!id)
            return res.status(400).json({ message: "id required" });
        const item = await service.deleteLocation(id);
        res.json(item);
    }
}
exports.InventoryController = InventoryController;
