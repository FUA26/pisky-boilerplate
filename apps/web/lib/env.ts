// apps/web/lib/env.ts
/**
 * Environment variables helper
 *
 * This provides type-safe access to environment variables.
 * For E2E testing, we provide defaults where possible.
 */

export const env = {
  // App URL (used for email links, reset URLs, etc.)
  NEXT_PUBLIC_APP_URL:
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3800",

  // NextAuth
  NEXTAUTH_SECRET:
    process.env.NEXTAUTH_SECRET ?? "test-secret-for-development-only",
  NEXTAUTH_URL: process.env.NEXTAUTH_URL ?? "http://localhost:3800",

  // Email (optional - for testing, we can log to console)
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASSWORD: process.env.SMTP_PASSWORD,
  SMTP_FROM: process.env.SMTP_FROM ?? "noreply@localhost",

  // S3 / MinIO
  AWS_REGION: process.env.AWS_REGION ?? "us-east-1",
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID ?? "test-key",
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY ?? "test-secret",
  S3_BUCKET: process.env.S3_BUCKET ?? "test-uploads",
  MINIO_ENDPOINT: process.env.MINIO_ENDPOINT,
  CDN_URL: process.env.CDN_URL,

  // Database
  DATABASE_URL: process.env.DATABASE_URL ?? "postgresql://localhost:5432/test",
} as const

export type Env = typeof env
