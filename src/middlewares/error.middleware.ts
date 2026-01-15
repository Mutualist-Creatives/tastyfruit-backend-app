import { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/response.util.js";
import config from "../config/index.js";

export interface AppError extends Error {
  statusCode?: number;
  details?: unknown;
}

export const errorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error("Error:", err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  // Hide internal error details in production
  const details =
    config.nodeEnv === "development" ? err.details || err.stack : undefined;

  sendError(res, message, statusCode, details);
};

export const notFoundHandler = (
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  sendError(res, "Route not found", 404);
};

export const createError = (
  message: string,
  statusCode = 500,
  details?: unknown
): AppError => {
  const error: AppError = new Error(message);
  error.statusCode = statusCode;
  error.details = details;
  return error;
};
