"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const express_useragent_1 = __importDefault(require("express-useragent"));
// routes
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const company_routes_1 = __importDefault(require("./routes/company.routes"));
const category_routes_1 = __importDefault(require("./routes/category.routes"));
const subcategory_routes_1 = __importDefault(require("./routes/subcategory.routes"));
const product_routes_1 = __importDefault(require("./routes/product.routes"));
const branch_routes_1 = __importDefault(require("./routes/branch.routes"));
const storage_routes_1 = __importDefault(require("./routes/storage.routes"));
const inventory_routes_1 = __importDefault(require("./routes/inventory.routes"));
const stock_routes_1 = __importDefault(require("./routes/stock.routes"));
const productInCompany_routes_1 = __importDefault(require("./routes/productInCompany.routes"));
const companyOnStorage_routes_1 = __importDefault(require("./routes/companyOnStorage.routes"));
const order_routes_1 = __importDefault(require("./routes/order.routes"));
const transfer_routes_1 = __importDefault(require("./routes/transfer.routes"));
const request_routes_1 = __importDefault(require("./routes/request.routes"));
const notification_routes_1 = __importDefault(require("./routes/notification.routes"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = require("./config/swagger");
const logger_1 = require("./middlewares/logger");
const socket_1 = require("./realtime/socket");
const database_1 = __importDefault(require("./database"));
const app = (0, express_1.default)();
app.use(express_useragent_1.default.express());
app.use((0, cors_1.default)({
    origin: '*',
    allowedHeaders: ['Content-Type', 'Admin-Key', "Authorization"],
    credentials: true
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(logger_1.requestLogger);
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});
const port = +process.env.PORT || 3000;
app.use('/api', user_routes_1.default);
app.use('/api', company_routes_1.default);
app.use('/api', category_routes_1.default);
app.use('/api', subcategory_routes_1.default);
app.use('/api', product_routes_1.default);
app.use('/api', branch_routes_1.default);
app.use('/api', storage_routes_1.default);
app.use('/api', inventory_routes_1.default);
app.use('/api', stock_routes_1.default);
app.use('/api', productInCompany_routes_1.default);
app.use('/api', companyOnStorage_routes_1.default);
app.use('/api', order_routes_1.default);
app.use('/api', transfer_routes_1.default);
app.use('/api', request_routes_1.default);
app.use('/api', notification_routes_1.default);
// Lightweight health check (no DB)
app.get('/api/health', (_req, res) => res.json({ ok: true }));
// Swagger UI
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.openapiSpec));
// Global error handler (catches async errors as well)
app.use(logger_1.errorHandler);
// const httpsServer = https.createServer(credentials, app);
const server = http_1.default.createServer(app);
(0, socket_1.initSocket)(server);
server.listen(port, () => {
    console.log(`HTTP + Socket.IO server running on :${port}`);
});
// On boot: Ensure nickname 'saad' has SUPER_ADMIN role
(async () => {
    try {
        const u = await database_1.default.user.findUnique({ where: { nickname: 'saad' }, select: { id: true, roles: true } });
        if (u && !(u.roles ?? []).includes('SUPER_ADMIN')) {
            const merged = Array.from(new Set([...(u.roles ?? []), 'SUPER_ADMIN']));
            await database_1.default.user.update({ where: { id: u.id }, data: { roles: { set: merged } } });
            console.log("Ensured 'saad' has SUPER_ADMIN role");
        }
    }
    catch (e) {
        console.warn('ensure SUPER_ADMIN failed:', e);
    }
})();
