import { getDatabaseStatus } from "../services/dbStatusService.js";

export const dbStatus = async (_req, res) => {
  try {
    const status = await getDatabaseStatus();
    const httpStatus = status.connected ? 200 : status.configured ? 503 : 500;

    return res.status(httpStatus).json(status);
  } catch (error) {
    return res.status(500).json({
      configured: false,
      connected: false,
      dnsResolved: false,
      message: error.message || "Unable to check database status"
    });
  }
};