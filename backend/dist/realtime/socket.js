"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSocket = initSocket;
exports.emitToUser = emitToUser;
exports.emitToCompany = emitToCompany;
exports.emitToOrder = emitToOrder;
exports.emitAll = emitAll;
const socket_io_1 = require("socket.io");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = __importDefault(require("../database"));
let io = null;
function initSocket(server) {
    io = new socket_io_1.Server(server, {
        cors: { origin: '*', credentials: true },
    });
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.toString()?.replace(/^Bearer\s+/i, "");
            if (!token)
                return next(); // allow anonymous, limited functionality
            const payload = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY);
            if (!payload?.nickname && !payload?.phone)
                return next(new Error('Invalid token payload'));
            const user = await database_1.default.user.findFirst({ where: { OR: [{ nickname: payload.nickname ?? "__" }, { phone: payload.phone ?? "__" }] }, select: { id: true } });
            if (user) {
                socket.userId = user.id;
            }
            next();
        }
        catch (e) {
            next();
        }
    });
    io.on('connection', (socket) => {
        const userId = socket.userId;
        if (userId) {
            socket.join(`user:${userId}`);
        }
        socket.on('join:company', (companyId) => {
            if (companyId)
                socket.join(`company:${companyId}`);
        });
        socket.on('leave:company', (companyId) => {
            if (companyId)
                socket.leave(`company:${companyId}`);
        });
        socket.on('join:order', (orderId) => {
            if (orderId)
                socket.join(`order:${orderId}`);
        });
        socket.on('leave:order', (orderId) => {
            if (orderId)
                socket.leave(`order:${orderId}`);
        });
    });
    return io;
}
function getIO() {
    if (!io)
        throw new Error('Socket.IO not initialized');
    return io;
}
function emitToUser(userId, event, data) {
    if (!io)
        return;
    io.to(`user:${userId}`).emit(event, data);
}
function emitToCompany(companyId, event, data) {
    if (!io)
        return;
    io.to(`company:${companyId}`).emit(event, data);
}
function emitToOrder(orderId, event, data) {
    if (!io)
        return;
    io.to(`order:${orderId}`).emit(event, data);
}
function emitAll(event, data) {
    if (!io)
        return;
    io.emit(event, data);
}
