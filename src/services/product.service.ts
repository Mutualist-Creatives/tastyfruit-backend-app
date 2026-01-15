import prisma from "../models/prisma.js";
import { Prisma } from "@prisma/client";
import { generateUniqueSlug } from "../utils/slug.util.js";
import { createError } from "../middlewares/error.middleware.js";

// Types
type CreateProductInput = Prisma.ProductCreateInput & {
  variations?: {
    id?: string;
    name: string;
    image: string;
    description?: string;
    slug?: string;
  }[];
};

type UpdateProductInput = Prisma.ProductUpdateInput & {
  variations?: {
    id?: string;
    name: string;
    image: string;
    description?: string;
    slug?: string;
  }[];
};

export const getAllProducts = async (page = 1, limit = 10, search?: string) => {
  const skip = (page - 1) * limit;
  const where: Prisma.ProductWhereInput = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        fruitTypes: {
          orderBy: { createdAt: "asc" },
        },
      },
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products,
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

export const getProductById = async (id: string) => {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      fruitTypes: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!product) {
    throw createError("Product not found", 404);
  }

  return product;
};

export const createProduct = async (data: CreateProductInput) => {
  const existingSlugs = await prisma.product.findMany({
    select: { slug: true },
  });
  const slug = generateUniqueSlug(
    data.name,
    existingSlugs.map((p: { slug: string }) => p.slug)
  );

  const product = await prisma.product.create({
    data: {
      name: data.name,
      slug,
      description: data.description,
      imageUrl: data.imageUrl,
      nutrition: data.nutrition as Prisma.InputJsonValue,
      fruitTypes: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        create: data.variations?.map((v: any) => ({
          name: v.name,
          image: v.image,
          description: v.description || "",
          slug:
            v.slug ||
            `${slug}-${v.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
        })),
      },
    },
    include: {
      fruitTypes: true,
    },
  });

  return product;
};

export const updateProduct = async (id: string, data: UpdateProductInput) => {
  // Check if product exists
  const existingProduct = await prisma.product.findUnique({ where: { id } });
  if (!existingProduct) {
    throw createError("Product not found", 404);
  }

  // Transaction for update
  await prisma.$transaction(async (tx) => {
    // 1. Update Product
    const updatedProduct = await tx.product.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        imageUrl: data.imageUrl,
        nutrition: data.nutrition as Prisma.InputJsonValue,
      },
    });

    // 2. Handle Variations (FruitTypes)
    if (data.variations) {
      const existingVariations = await tx.fruitType.findMany({
        where: { productId: id },
        select: { id: true },
      });
      const existingIds = existingVariations.map((v) => v.id);

      const incomingIds = data.variations
        .filter((v) => v.id)
        .map((v) => v.id as string);

      // Delete removed variations
      const toDeleteIds = existingIds.filter(
        (eid) => !incomingIds.includes(eid)
      );
      if (toDeleteIds.length > 0) {
        await tx.fruitType.deleteMany({
          where: { id: { in: toDeleteIds } },
        });
      }

      // Upsert
      for (const v of data.variations) {
        const vSlug =
          v.slug ||
          (updatedProduct.slug
            ? `${updatedProduct.slug}-${v.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")}`
            : `${v.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`);

        if (v.id && existingIds.includes(v.id)) {
          await tx.fruitType.update({
            where: { id: v.id },
            data: {
              name: v.name,
              image: v.image,
              description: v.description || "",
            },
          });
        } else {
          await tx.fruitType.create({
            data: {
              productId: id,
              name: v.name,
              image: v.image,
              description: v.description || "",
              slug: vSlug,
            },
          });
        }
      }
    }

    return updatedProduct;
  });

  // Return final result
  const finalProduct = await prisma.product.findUnique({
    where: { id },
    include: { fruitTypes: true },
  });

  return finalProduct;
};

export const deleteProduct = async (id: string) => {
  const existingProduct = await prisma.product.findUnique({ where: { id } });
  if (!existingProduct) {
    throw createError("Product not found", 404);
  }

  await prisma.product.delete({
    where: { id },
  });

  return { message: "Product deleted successfully" };
};
