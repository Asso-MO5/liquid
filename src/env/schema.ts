import { z } from "zod";

export const serverScheme = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  BLOG_URL: z.string(),
});

export const clientScheme = z.object({
  MODE: z.enum(['development', 'production', 'test']).default('development'),
  VITE_API_URL: z.string(),
  VITE_BLOG_URL: z.string(),
  VITE_CAVE_URL: z.string(),
  VITE_STRIPE_PUBLISHABLE_KEY: z.string(),
  VITE_KITANA_URL: z.string(),
});
