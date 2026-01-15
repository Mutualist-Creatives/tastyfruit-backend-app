import prisma from "../models/prisma.js";
import { Prisma } from "@prisma/client";
import { createError } from "../middlewares/error.middleware.js";

export const getAllRecipes = async (page = 1, limit = 10, search?: string) => {
  const skip = (page - 1) * limit;
  const where: Prisma.RecipeWhereInput = {};

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  const [recipes, totalCount] = await Promise.all([
    prisma.recipe.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.recipe.count({ where }),
  ]);

  return {
    recipes,
    pagination: {
      page,
      limit,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      hasNext: page < Math.ceil(totalCount / limit),
      hasPrev: page > 1,
    },
  };
};

export const getRecipeById = async (id: string) => {
  const recipe = await prisma.recipe.findUnique({
    where: { id },
  });

  if (!recipe) {
    throw createError("Recipe not found", 404);
  }

  return recipe;
};

export const createRecipe = async (data: Prisma.RecipeCreateInput) => {
  const recipe = await prisma.recipe.create({
    data,
  });
  return recipe;
};

export const updateRecipe = async (
  id: string,
  data: Prisma.RecipeUpdateInput
) => {
  const existingRecipe = await prisma.recipe.findUnique({ where: { id } });
  if (!existingRecipe) {
    throw createError("Recipe not found", 404);
  }

  const recipe = await prisma.recipe.update({
    where: { id },
    data,
  });

  return recipe;
};

export const deleteRecipe = async (id: string) => {
  const existingRecipe = await prisma.recipe.findUnique({ where: { id } });
  if (!existingRecipe) {
    throw createError("Recipe not found", 404);
  }

  await prisma.recipe.delete({
    where: { id },
  });

  return { message: "Recipe deleted successfully" };
};
