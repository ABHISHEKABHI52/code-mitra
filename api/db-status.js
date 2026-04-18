import { getDatabaseStatus } from "../server/services/dbStatusService.js";
import { json, preflight } from "./_utils.js";

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    return preflight(res);
  }

  if (req.method !== "GET") {
    return json(res, 405, { error: "Use GET /api/db-status" });
  }

  try {
    const status = await getDatabaseStatus();
    const httpStatus = status.connected ? 200 : status.configured ? 503 : 500;
    return json(res, httpStatus, status);
  } catch (error) {
    return json(res, 500, {
      configured: false,
      connected: false,
      dnsResolved: false,
      message: error.message || "Unable to check database status"
    });
  }
}