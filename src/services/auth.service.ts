import { Prisma } from "@prisma/client";
import prisma from "../models/prisma.js";
import { hashPassword, comparePassword } from "../utils/bcrypt.util.js";
import { signToken } from "../utils/jwt.util.js";
import { createError } from "../middlewares/error.middleware.js";

export const register = async (data: Prisma.UserCreateInput) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw createError("Email already registered", 409);
  }

  const hashedPassword = await hashPassword(data.password || "");

  const user = await prisma.user.create({
    data: {
      ...data,
      password: hashedPassword,
      role: data.role || "user", // Default role
    },
  });

  const token = signToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  return { user, token };
};

export const login = async (email: string, passwordInput: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !user.password) {
    throw createError("Invalid email or password", 401);
  }

  const isPasswordValid = await comparePassword(passwordInput, user.password);

  if (!isPasswordValid) {
    throw createError("Invalid email or password", 401);
  }

  const token = signToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  return { user, token };
};

export const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      image: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw createError("User not found", 404);
  }

  return user;
};

export const changePassword = async (
  userId: string,
  data: { currentPassword: string; newPassword: string }
) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user || !user.password) {
    throw createError("User not found", 404);
  }

  const isPasswordValid = await comparePassword(
    data.currentPassword,
    user.password
  );

  if (!isPasswordValid) {
    throw createError("Password saat ini salah", 400);
  }

  const hashedPassword = await hashPassword(data.newPassword);

  await prisma.user.update({
    where: { id: userId },
    data: {
      password: hashedPassword,
    },
  });

  return { message: "Password berhasil diubah" };
};
