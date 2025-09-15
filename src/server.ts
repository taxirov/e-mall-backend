import dotenv from "dotenv";
dotenv.config();
import express, { type NextFunction, type Request, type Response } from "express";
import http from 'http';
import cors from "cors";
import useragent from "express-useragent";
// routes
import userRoutes from "./routes/user.routes";
import companyRoutes from "./routes/company.routes";
import categoryRoutes from "./routes/category.routes";
import subcategoryRoutes from "./routes/subcategory.routes";
import productRoutes from "./routes/product.routes";
import branchRoutes from "./routes/branch.routes";
import storageRoutes from "./routes/storage.routes";
import inventoryRoutes from "./routes/inventory.routes";
import stockRoutes from "./routes/stock.routes";
import productInCompanyRoutes from "./routes/productInCompany.routes";
import companyOnStorageRoutes from "./routes/companyOnStorage.routes";
import orderRoutes from "./routes/order.routes";
import transferRoutes from "./routes/transfer.routes";
import requestRoutes from "./routes/request.routes";
import notificationRoutes from "./routes/notification.routes";
import swaggerUi from "swagger-ui-express";
import { openapiSpec } from "./config/swagger";
import { errorHandler, requestLogger } from "./middlewares/logger";
import { initSocket } from "./realtime/socket";
import prisma from "./database";

const app = express();
app.use(useragent.express())

app.use(cors({
  origin: '*',
  allowedHeaders: ['Content-Type', 'Admin-Key', "Authorization"],
  credentials: true
},
));
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(requestLogger)
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  next()
})

const port = +process.env.PORT! || 3000;

app.use('/api', userRoutes)
app.use('/api', companyRoutes)
app.use('/api', categoryRoutes)
app.use('/api', subcategoryRoutes)
app.use('/api', productRoutes)
app.use('/api', branchRoutes)
app.use('/api', storageRoutes)
app.use('/api', inventoryRoutes)
app.use('/api', stockRoutes)
app.use('/api', productInCompanyRoutes)
app.use('/api', companyOnStorageRoutes)
app.use('/api', orderRoutes)
app.use('/api', transferRoutes)
app.use('/api', requestRoutes)
app.use('/api', notificationRoutes)

// Lightweight health check (no DB)
app.get('/api/health', (_req, res) => res.json({ ok: true }))

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));

// Global error handler (catches async errors as well)
app.use(errorHandler)
// const httpsServer = https.createServer(credentials, app);

const server = http.createServer(app);
initSocket(server);
server.listen(port, () => {
  console.log(`HTTP + Socket.IO server running on :${port}`);
});

// On boot: Ensure nickname 'saad' has SUPER_ADMIN role
(async () => {
  try {
    const u = await prisma.user.findUnique({ where: { nickname: 'saad' }, select: { id: true, roles: true } });
    if (u && !(u.roles ?? []).includes('SUPER_ADMIN' as any)) {
      const merged = Array.from(new Set([...(u.roles ?? []), 'SUPER_ADMIN' as any]));
      await prisma.user.update({ where: { id: u.id }, data: { roles: { set: merged as any } } });
      console.log("Ensured 'saad' has SUPER_ADMIN role");
    }
  } catch (e) {
    console.warn('ensure SUPER_ADMIN failed:', e);
  }
})();
