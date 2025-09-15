"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateQuery = exports.validateBody = void 0;
const validateBody = (schema) => async (req, res, next) => {
    try {
        const value = await schema.validateAsync(req.body, { abortEarly: false, stripUnknown: true });
        req.body = value;
        next();
    }
    catch (e) {
        res.status(400).json({ message: "Validation error", details: e.details?.map((d) => d.message) ?? [e.message] });
    }
};
exports.validateBody = validateBody;
const validateQuery = (schema) => async (req, res, next) => {
    try {
        const value = await schema.validateAsync(req.query, { abortEarly: false, stripUnknown: true });
        req.query = value;
        next();
    }
    catch (e) {
        res.status(400).json({ message: "Validation error", details: e.details?.map((d) => d.message) ?? [e.message] });
    }
};
exports.validateQuery = validateQuery;
