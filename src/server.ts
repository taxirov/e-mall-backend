import dotenv from "dotenv";
dotenv.config();
import express, { type NextFunction, type Request, type Response } from "express";
import cors from "cors";
import useragent from "express-useragent";
// routes
import userRoutes from "../src/routes/user.routes";

const app = express();
app.use(useragent.express())

app.use(cors({
  origin: '*',
  allowedHeaders: ['Content-Type', 'Access-Token', 'Admin-Key'],
  credentials: true
},
));
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  next()
})

const port = +process.env.PORT! || 3000;

app.use('/api', userRoutes)
// const httpsServer = https.createServer(credentials, app);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});