import { z } from "zod";

export const categorySchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Title must be at least 2 characters")
    .max(60, "Title must be within 60 characters"),
});
