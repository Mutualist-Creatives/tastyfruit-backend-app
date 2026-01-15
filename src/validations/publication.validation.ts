import { z } from "zod";

export const createPublicationSchema = z.object({
  title: z
    .string()
    .min(1, "Judul publikasi harus diisi")
    .max(200, "Judul maksimal 200 karakter"),
  content: z.string().min(1, "Konten harus diisi"),
  excerpt: z.string().max(500, "Excerpt maksimal 500 karakter").optional(),
  author: z.string().min(1, "Nama author harus diisi"),
  category: z.string().min(1, "Kategori harus dipilih"),
  imageUrl: z
    .string()
    .url("URL gambar tidak valid")
    .optional()
    .or(z.literal("")),
  isPublished: z.boolean().default(false),
  publishedAt: z.string().optional(), // Receive as string, service can convert to Date
});

export const updatePublicationSchema = createPublicationSchema.partial();

export const publicationQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
  category: z.string().optional(),
});
