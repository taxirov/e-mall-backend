import dotenv from "dotenv";
dotenv.config();
import express, { type NextFunction, type Request, type Response } from "express";
import cors from "cors";
import useragent from "express-useragent";
// routes
import userRoutes from "../src/routes/user.routes";
import companyRoutes from "../src/routes/company.routes";
import categoryRoutes from "../src/routes/category.routes";
import subcategoryRoutes from "../src/routes/subcategory.routes";
import productRoutes from "../src/routes/product.routes";
import branchRoutes from "../src/routes/branch.routes";
import storageRoutes from "../src/routes/storage.routes";
import inventoryRoutes from "../src/routes/inventory.routes";
import stockRoutes from "../src/routes/stock.routes";
import productInCompanyRoutes from "../src/routes/productInCompany.routes";
import companyOnStorageRoutes from "../src/routes/companyOnStorage.routes";
import orderRoutes from "../src/routes/order.routes";
import transferRoutes from "../src/routes/transfer.routes";
import requestRoutes from "../src/routes/request.routes";
import notificationRoutes from "../src/routes/notification.routes";
import swaggerUi from "swagger-ui-express";
import { openapiSpec } from "./config/swagger";
import { errorHandler, requestLogger } from "./middlewares/logger";

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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
