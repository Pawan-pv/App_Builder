import dotenv from "dotenv";

dotenv.config();

/**
 * Helper to require critical variables (like DB and Secrets)
 * but allow optional ones to prevent crashing during development.
 */
function requireEnv(key: string, defaultValue?: string): string {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`❌ Missing required environment variable: ${key}`);
  }
  return value;
}

export const env = {
  PORT: Number(process.env.PORT ?? 4000),
  NODE_ENV: process.env.NODE_ENV ?? "development",

  // Critical Variables - The app will crash if these are missing
  JWT_SECRET: requireEnv("JWT_SECRET", "super-secret-dev-key"),
  DATABASE_URL: requireEnv("DATABASE_URL"),

  // App Builder Specifics
  // Added a fallback for DIRECT_URL so the backend doesn't crash
  DIRECT_URL: process.env.DIRECT_URL ?? "http://localhost:3000", 
};