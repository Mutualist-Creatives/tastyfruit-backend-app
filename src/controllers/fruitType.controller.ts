import { Request, Response, NextFunction } from "express";
import * as fruitTypeService from "../services/fruitType.service.js";
import { sendSuccess, sendCreated } from "../utils/response.util.js";

export const getFruitTypes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const productId = (req.query.productId as string) || undefined;
    const fruitTypes = await fruitTypeService.getFruitTypes(productId);
    sendSuccess(res, { fruitTypes }); // Wrap in object to match old API response structure if needed, or just array
  } catch (error) {
    next(error);
  }
};

export const getFruitType = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const fruitType = await fruitTypeService.getFruitTypeById(id as string);
    sendSuccess(res, fruitType);
  } catch (error) {
    next(error);
  }
};

export const createFruitType = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const fruitType = await fruitTypeService.createFruitType(req.body);
    sendCreated(res, fruitType);
  } catch (error) {
    next(error);
  }
};

export const updateFruitType = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const fruitType = await fruitTypeService.updateFruitType(
      id as string,
      req.body
    );
    sendSuccess(res, fruitType);
  } catch (error) {
    next(error);
  }
};

export const deleteFruitType = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const result = await fruitTypeService.deleteFruitType(id as string);
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
};
