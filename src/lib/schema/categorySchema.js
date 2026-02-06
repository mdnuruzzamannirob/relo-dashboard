import { z } from "zod";

export const categorySchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Category name must be at least 2 characters")
    .max(60, "Category name must be within 60 characters"),
  description: z
    .string()
    .trim()
    .max(160, "Description must be within 160 characters")
    .optional()
    .or(z.literal("")),
});
