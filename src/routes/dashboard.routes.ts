import { Router } from "express";
import * as dashboardController from "../controllers/dashboard.controller.js";
import { authenticate, requireRole } from "../middlewares/auth.middleware.js";

const router = Router();

router.get(
  "/stats",
  authenticate,
  requireRole("admin", "editor"),
  dashboardController.getStats
);

export default router;
