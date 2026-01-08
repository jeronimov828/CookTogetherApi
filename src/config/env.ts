import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
  PORT: number;
  DB_HOST: string;
  DB_PORT: number;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  JWT_SECRET: string;
  NODE_ENV: "development" | "production" | "test";
}

function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Variable de entorno faltante: ${key}`);
  }
  return value;
}

export const env: EnvConfig = {
  PORT: Number(process.env.PORT) || 3000,
  DB_HOST: getEnvVar("DB_HOST", "localhost"),
  DB_PORT: Number(process.env.DB_PORT) || 5432,
  DB_USER: getEnvVar("DB_USER", "postgres"),
  DB_PASSWORD: getEnvVar("DB_PASSWORD"),
  DB_NAME: getEnvVar("DB_NAME", "CookTogether"),
  JWT_SECRET: getEnvVar("JWT_SECRET"),
  NODE_ENV: (process.env.NODE_ENV as EnvConfig["NODE_ENV"]) || "development",
};

