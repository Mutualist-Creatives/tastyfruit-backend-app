import prisma from "../models/prisma.js";
import { Prisma } from "@prisma/client";
import { createError } from "../middlewares/error.middleware.js";

export const getAllPublications = async (
  page = 1,
  limit = 10,
  search?: string,
  category?: string
) => {
  const skip = (page - 1) * limit;
  const where: Prisma.PublicationWhereInput = {};

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { content: { contains: search, mode: "insensitive" } },
    ];
  }

  if (category) {
    where.category = category;
  }

  const [publications, totalCount] = await Promise.all([
    prisma.publication.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.publication.count({ where }),
  ]);

  return {
    publications,
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

export const getPublicationById = async (id: string) => {
  const publication = await prisma.publication.findUnique({
    where: { id },
  });

  if (!publication) {
    throw createError("Publication not found", 404);
  }

  return publication;
};

export const createPublication = async (
  data: Prisma.PublicationCreateInput & { publishedAt?: string }
) => {
  // Convert publishedAt string to Date if present
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const publicationData: any = { ...data };
  if (data.publishedAt && typeof data.publishedAt === "string") {
    publicationData.publishedAt = new Date(data.publishedAt);
  }

  const publication = await prisma.publication.create({
    data: publicationData as Prisma.PublicationCreateInput,
  });
  return publication;
};

export const updatePublication = async (
  id: string,
  data: Prisma.PublicationUpdateInput & { publishedAt?: string }
) => {
  const existingPublication = await prisma.publication.findUnique({
    where: { id },
  });
  if (!existingPublication) {
    throw createError("Publication not found", 404);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const publicationData: any = { ...data };
  if (data.publishedAt && typeof data.publishedAt === "string") {
    publicationData.publishedAt = new Date(data.publishedAt);
  }

  const publication = await prisma.publication.update({
    where: { id },
    data: publicationData as Prisma.PublicationUpdateInput,
  });

  return publication;
};

export const deletePublication = async (id: string) => {
  const existingPublication = await prisma.publication.findUnique({
    where: { id },
  });
  if (!existingPublication) {
    throw createError("Publication not found", 404);
  }

  await prisma.publication.delete({
    where: { id },
  });

  return { message: "Publication deleted successfully" };
};
