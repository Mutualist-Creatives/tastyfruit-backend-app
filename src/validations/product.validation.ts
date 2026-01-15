import { z } from "zod";

export const nutritionSchema = z.object({
  energi: z.string().optional(),
  lemak: z.string().optional(),
  kolesterol: z.string().optional(),
  serat: z.string().optional(),
  karbo: z.string().optional(),
  protein: z.string().optional(),
  natrium: z.string().optional(),
  magnesium: z.string().optional(),
  kalium: z.string().optional(),
});

export const variationSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Nama variasi wajib diisi"),
  image: z.string().min(1, "Gambar variasi wajib diisi"),
  description: z.string().optional(),
  slug: z.string().optional(),
});

export const createProductSchema = z.object({
  name: z
    .string()
    .min(1, "Nama produk harus diisi")
    .max(100, "Nama produk maksimal 100 karakter"),
  description: z.string().optional(),
  imageUrl: z
    .string()
    .url("URL gambar tidak valid")
    .optional()
    .or(z.literal("")),
  nutrition: nutritionSchema.optional(),
  variations: z.array(variationSchema).optional(),
});

export const updateProductSchema = createProductSchema.partial();

export const productQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
});
