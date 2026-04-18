import { json } from "./_utils.js";

export default function handler(_req, res) {
  json(res, 200, {
    message: "🚀 CodeMitra API is running",
    version: "1.0.0",
    endpoints: {
      health: "/api/health",
      explain: "POST /api/explain",
      dbStatus: "/api/db-status"
    },
    docs: "Visit the deployed frontend for the app"
  });
}