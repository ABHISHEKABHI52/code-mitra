import express from "express";
import { dbStatus } from "../controllers/dbStatusController.js";

const router = express.Router();

router.get("/db-status", dbStatus);

export default router;