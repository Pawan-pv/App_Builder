// c:\my-project\soft-projects\backend\src\app.ts
import express from "express";
import cors from "cors";
import helmet from "helmet";
import routes from "./routes.js";
import { errorHandler } from "./utils/error.middleware.js";

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Main API Routes
app.use("/api", routes);

// Global Error Handler (MUST BE LAST)
app.use(errorHandler);

export default app;