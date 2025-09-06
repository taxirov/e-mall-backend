"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_useragent_1 = __importDefault(require("express-useragent"));
// routes
const user_routes_1 = __importDefault(require("../src/routes/user.routes"));
const app = (0, express_1.default)();
app.use(express_useragent_1.default.express());
app.use((0, cors_1.default)({
    origin: '*',
    allowedHeaders: ['Content-Type', 'Access-Token', 'Admin-Key'],
    credentials: true
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});
const port = +process.env.PORT || 3000;
app.use('/api/user', user_routes_1.default);
// const httpsServer = https.createServer(credentials, app);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
