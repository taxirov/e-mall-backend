"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = requestLogger;
exports.errorHandler = errorHandler;
function requestLogger(req, res, next) {
    const started = Date.now();
    const { method, url } = req;
    const ip = req.ip;
    console.log(`[REQ] ${method} ${url} from ${ip}`);
    res.on('finish', () => {
        const ms = Date.now() - started;
        console.log(`[RES] ${method} ${url} -> ${res.statusCode} (${ms}ms)`);
    });
    next();
}
function errorHandler(err, req, res, next) {
    console.error('[ERR]', err);
    if (res.headersSent)
        return next(err);
    res.status(500).json({ message: 'Internal Server Error', error: typeof err === 'string' ? err : err?.message });
}
