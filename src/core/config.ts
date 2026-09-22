import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(3000),
  APP_NAME: z.string().default('Recreation in Sport'),
  APP_URL: z.string().default('http://localhost:3000'),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  JWT_ACCESS_TTL: z.coerce.number().default(3600),
  JWT_REFRESH_TTL: z.coerce.number().default(604800),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  MAIL_FROM: z.string().default('noreply@example.com'),
  MAIL_DRIVER: z.string().default('log'),
});

export const config = envSchema.parse(process.env);
