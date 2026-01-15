import { Request, Response, NextFunction } from "express";
import * as authService from "../services/auth.service.js";
import { sendSuccess, sendCreated } from "../utils/response.util.js";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password, role } = req.body;
    const result = await authService.register({
      name,
      email,
      password,
      role, // Optional, defaults to 'user' in service if not provided, but usually guarded by admin logic
    });
    sendCreated(res, result, "User registered successfully");
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    sendSuccess(res, result, "Login successful");
  } catch (error) {
    next(error);
  }
};

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new Error("User ID missing from request");
    }
    const user = await authService.getMe(userId);
    sendSuccess(res, user);
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new Error("User ID missing from request");
    }
    const { currentPassword, newPassword } = req.body;
    const result = await authService.changePassword(userId, {
      currentPassword,
      newPassword,
    });
    sendSuccess(res, result, "Password changed successfully");
  } catch (error) {
    next(error);
  }
};
