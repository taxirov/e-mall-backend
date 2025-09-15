"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyOnStorageController = void 0;
const companyOnStorage_service_1 = require("../services/companyOnStorage.service");
const service = new companyOnStorage_service_1.CompanyOnStorageService();
class CompanyOnStorageController {
    async link(req, res) {
        try {
            const item = await service.link(req.body);
            res.status(201).json(item);
        }
        catch (e) {
            res.status(400).json({ message: e.message });
        }
    }
    async unlink(req, res) {
        const companyId = Number(req.params.companyId);
        const storageId = Number(req.params.storageId);
        if (!companyId || !storageId)
            return res.status(400).json({ message: "companyId and storageId required" });
        const item = await service.unlink(companyId, storageId);
        res.json(item);
    }
    async listStorages(req, res) {
        const companyId = Number(req.params.companyId);
        if (!companyId)
            return res.status(400).json({ message: "companyId required" });
        const list = await service.listStorages(companyId);
        res.json(list);
    }
    async listCompanies(req, res) {
        const storageId = Number(req.params.storageId);
        if (!storageId)
            return res.status(400).json({ message: "storageId required" });
        const list = await service.listCompanies(storageId);
        res.json(list);
    }
    async setPrimary(req, res) {
        const companyId = Number(req.params.companyId);
        const storageId = Number(req.params.storageId);
        const { isPrimary } = req.body;
        if (!companyId || !storageId || typeof isPrimary !== "boolean")
            return res.status(400).json({ message: "companyId, storageId, isPrimary required" });
        const item = await service.setPrimary(companyId, storageId, isPrimary);
        res.json(item);
    }
}
exports.CompanyOnStorageController = CompanyOnStorageController;
