import prisma from "../models/prisma.js";
import { Prisma } from "@prisma/client";
import { createError } from "../middlewares/error.middleware.js";
import { generateSlug } from "../utils/slug.util.js";

export const getFruitTypes = async (productId?: string) => {
  const where: Prisma.FruitTypeWhereInput = {};
  if (productId) {
    where.productId = productId;
  }

  const fruitTypes = await prisma.fruitType.findMany({
    where,
    include: {
      product: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return fruitTypes;
};

export const getFruitTypeById = async (id: string) => {
  const fruitType = await prisma.fruitType.findUnique({
    where: { id },
    include: {
      product: {
        select: { id: true, name: true, slug: true },
      },
    },
  });

  if (!fruitType) {
    throw createError("Fruit Type not found", 404);
  }

  return fruitType;
};

export const createFruitType = async (data: Prisma.FruitTypeCreateInput) => {
  // Ensure slug exists or generate it
  if (!data.slug) {
    data.slug = generateSlug(data.name);
  }

  const fruitType = await prisma.fruitType.create({
    data,
    include: {
      product: {
        select: { id: true, name: true, slug: true },
      },
    },
  });

  return fruitType;
};

export const updateFruitType = async (
  id: string,
  data: Prisma.FruitTypeUpdateInput
) => {
  const existingFruitType = await prisma.fruitType.findUnique({
    where: { id },
  });
  if (!existingFruitType) {
    throw createError("Fruit Type not found", 404);
  }

  const fruitType = await prisma.fruitType.update({
    where: { id },
    data,
    include: {
      product: {
        select: { id: true, name: true, slug: true },
      },
    },
  });

  return fruitType;
};

export const deleteFruitType = async (id: string) => {
  const existingFruitType = await prisma.fruitType.findUnique({
    where: { id },
  });
  if (!existingFruitType) {
    throw createError("Fruit Type not found", 404);
  }

  await prisma.fruitType.delete({
    where: { id },
  });

  return { message: "Fruit Type deleted successfully" };
};
