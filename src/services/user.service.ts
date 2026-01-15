import prisma from "../models/prisma.js";
import { Prisma } from "@prisma/client";
import { createError } from "../middlewares/error.middleware.js";
import { hashPassword } from "../utils/bcrypt.util.js";

export const getAllUsers = async (page = 1, limit = 10, search?: string) => {
  const skip = (page - 1) * limit;
  const where: Prisma.UserWhereInput = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }

  const [users, totalCount] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);

  return {
    users,
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

export const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      image: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw createError("User not found", 404);
  }

  return user;
};

export const createUser = async (data: Prisma.UserCreateInput) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw createError("Email already registered", 409);
  }

  const hashedPassword = await hashPassword(data.password || "password123");

  const user = await prisma.user.create({
    data: {
      ...data,
      password: hashedPassword,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      image: true,
      createdAt: true,
    },
  });

  return user;
};

export const updateUser = async (id: string, data: Prisma.UserUpdateInput) => {
  const existingUser = await prisma.user.findUnique({ where: { id } });
  if (!existingUser) {
    throw createError("User not found", 404);
  }

  if (data.password && typeof data.password === "string") {
    data.password = await hashPassword(data.password);
  }

  const user = await prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      image: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
};

export const deleteUser = async (id: string) => {
  const existingUser = await prisma.user.findUnique({ where: { id } });
  if (!existingUser) {
    throw createError("User not found", 404);
  }

  await prisma.user.delete({
    where: { id },
  });

  return { message: "User deleted successfully" };
};
