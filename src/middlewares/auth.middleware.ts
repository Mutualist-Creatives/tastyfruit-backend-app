/* eslint-disable @typescript-eslint/no-namespace */
import { Request, Response, NextFunction } from "express";
import {
  verifyToken,
  extractTokenFromHeader,
  JwtPayload,
} from "../utils/jwt.util.js";
import { sendUnauthorized, sendForbidden } from "../utils/response.util.js";

// eslint-disable-next-line @typescript-eslint/no-namespace
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);

    if (!token) {
      sendUnauthorized(res, "No token provided");
      return;
    }

    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch {
    sendUnauthorized(res, "Invalid or expired token");
  }
};

export const requireRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendUnauthorized(res, "Authentication required");
      return;
    }

    if (!roles.includes(req.user.role)) {
      sendForbidden(res, "Insufficient permissions");
      return;
    }

    next();
  };
};

export const optionalAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);

    if (token) {
      const payload = verifyToken(token);
      req.user = payload;
    }

    next();
  } catch {
    // Token invalid, but continue without auth
    next();
  }
};
