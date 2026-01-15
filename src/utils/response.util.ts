import { Response } from "express";

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  details?: unknown;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message?: string,
  statusCode = 200
): Response => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendPaginated = <T>(
  res: Response,
  data: T[],
  pagination: PaginatedResponse<T>["pagination"],
  message?: string
): Response => {
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination,
  });
};

export const sendError = (
  res: Response,
  error: string,
  statusCode = 500,
  details?: unknown
): Response => {
  return res.status(statusCode).json({
    success: false,
    error,
    details,
  });
};

export const sendCreated = <T>(
  res: Response,
  data: T,
  message = "Created successfully"
): Response => {
  return sendSuccess(res, data, message, 201);
};

export const sendNotFound = (
  res: Response,
  resource = "Resource"
): Response => {
  return sendError(res, `${resource} not found`, 404);
};

export const sendUnauthorized = (
  res: Response,
  message = "Unauthorized"
): Response => {
  return sendError(res, message, 401);
};

export const sendForbidden = (
  res: Response,
  message = "Forbidden"
): Response => {
  return sendError(res, message, 403);
};

export const sendBadRequest = (
  res: Response,
  message = "Bad request",
  details?: unknown
): Response => {
  return sendError(res, message, 400, details);
};
