import { Request, Response, NextFunction } from "express";
import * as productService from "../services/product.service.js";
import {
  sendSuccess,
  sendCreated,
  sendPaginated,
} from "../utils/response.util.js";

export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt((req.query.page as string) || "1");
    const limit = parseInt((req.query.limit as string) || "10");
    const search = (req.query.search as string) || "";

    const result = await productService.getAllProducts(page, limit, search);
    sendPaginated(res, result.products, result.pagination);
  } catch (error) {
    next(error);
  }
};

export const getProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(id as string);
    sendSuccess(res, product);
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product = await productService.createProduct(req.body);
    sendCreated(res, product);
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const product = await productService.updateProduct(id as string, req.body);
    sendSuccess(res, product);
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const result = await productService.deleteProduct(id as string);
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
};
