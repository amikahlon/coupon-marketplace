import express from "express";
import cors from "cors";
import helmet from "helmet";
import { notFoundHandler, errorHandler } from "./middleware/error-handler";

export const app = express();

// Global middleware
app.use(helmet()); // sensible security headers
app.use(cors()); // allow the frontend to call the API
app.use(express.json()); // parse JSON request bodies

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// 404 + error handling
app.use(notFoundHandler);
app.use(errorHandler);
