import { Request, Response, NextFunction } from "express";
import * as userService from "../services/user.service.js";
import {
  sendSuccess,
  sendCreated,
  sendPaginated,
} from "../utils/response.util.js";

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt((req.query.page as string) || "1");
    const limit = parseInt((req.query.limit as string) || "10");
    const search = (req.query.search as string) || "";

    const result = await userService.getAllUsers(page, limit, search);
    sendPaginated(res, result.users, result.pagination);
  } catch (error) {
    next(error);
  }
};

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id as string);
    sendSuccess(res, user);
  } catch (error) {
    next(error);
  }
};

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await userService.createUser(req.body);
    sendCreated(res, user);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const user = await userService.updateUser(id as string, req.body);
    sendSuccess(res, user);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const result = await userService.deleteUser(id as string);
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
};
