import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import explainRoutes from "./routes/explainRoutes.js";
import dbRoutes from "./routes/dbRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, ".env.local") });
dotenv.config({ path: resolve(__dirname, ".env") });

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    message: "🚀 CodeMitra API is running",
    version: "1.0.0",
    endpoints: {
      health: "/api/health",
      explain: "POST /api/explain",
      dbStatus: "/api/db-status"
    },
    docs: "Visit http://localhost:5173 for the frontend"
  });
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "CodeMitra API" });
});

app.use("/api", explainRoutes);
app.use("/api", dbRoutes);

export default app;
