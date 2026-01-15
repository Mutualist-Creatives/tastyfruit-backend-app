import { z } from "zod";

const ingredientSchema = z.object({
  name: z.string().min(1),
  amount: z.string().min(1),
  note: z.string().optional(),
});

const instructionSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});

export const createRecipeSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  ingredients: z.array(ingredientSchema).min(1),
  instructions: z.array(instructionSchema).min(1),
  cookingTime: z.string().optional(), // Changed to string to match Prisma schema comment "60 minutes"
  servings: z.string().optional(), // Changed to string to match Prisma schema
  difficulty: z.enum(["Easy", "Medium", "Hard"]).default("Easy"),
  imageUrl: z.string().url().optional().or(z.literal("")),
  author: z.string().min(1),
  isPublished: z.boolean().default(false),
});

export const updateRecipeSchema = createRecipeSchema.partial();

export const recipeQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
});
