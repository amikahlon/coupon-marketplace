import express from "express";
import cors from "cors";
import helmet from "helmet";
import { notFoundHandler, errorHandler } from "./middleware/error-handler";
import resellerRoutes from "./routes/reseller.routes";
import storefrontRoutes from "./routes/storefront.routes";
import adminRoutes from "./routes/admin.routes";
import swaggerUi from "swagger-ui-express";
import { openapiSpec } from "./docs/openapi";

export const app = express();

// Global middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors()); // allow the frontend to call the API
app.use(express.json()); // parse JSON request bodies

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/v1/products", resellerRoutes);
app.use("/api/storefront/products", storefrontRoutes);
app.use("/api/admin/products", adminRoutes);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(openapiSpec));

// 404 + error handling
app.use(notFoundHandler);
app.use(errorHandler);
