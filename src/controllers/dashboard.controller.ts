import { Request, Response, NextFunction } from "express";
import * as dashboardService from "../services/dashboard.service.js";
import { sendSuccess } from "../utils/response.util.js";

export const getStats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const stats = await dashboardService.getStats();
    sendSuccess(res, stats);
  } catch (error) {
    next(error);
  }
};
