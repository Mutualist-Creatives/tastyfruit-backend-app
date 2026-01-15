import { Request, Response, NextFunction } from "express";
import * as recipeService from "../services/recipe.service.js";
import {
  sendSuccess,
  sendCreated,
  sendPaginated,
} from "../utils/response.util.js";

export const getRecipes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt((req.query.page as string) || "1");
    const limit = parseInt((req.query.limit as string) || "10");
    const search = (req.query.search as string) || "";

    const result = await recipeService.getAllRecipes(page, limit, search);
    sendPaginated(res, result.recipes, result.pagination);
  } catch (error) {
    next(error);
  }
};

export const getRecipe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const recipe = await recipeService.getRecipeById(id as string);
    sendSuccess(res, recipe);
  } catch (error) {
    next(error);
  }
};

export const createRecipe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const recipe = await recipeService.createRecipe(req.body);
    sendCreated(res, recipe);
  } catch (error) {
    next(error);
  }
};

export const updateRecipe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const recipe = await recipeService.updateRecipe(id as string, req.body);
    sendSuccess(res, recipe);
  } catch (error) {
    next(error);
  }
};

export const deleteRecipe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const result = await recipeService.deleteRecipe(id as string);
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
};
