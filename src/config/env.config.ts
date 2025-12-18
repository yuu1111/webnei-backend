import { z } from "zod";
import { createLogger } from "../utils/logger";

const logger = createLogger("env-config");

/**
 * 環境変数のスキーマ定義と型安全なバリデーション
 */
const envSchema = z
  .object({
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),

    PORT: z.coerce.number().int().min(1).max(65535).default(5000),
    HOST: z.string().default("0.0.0.0"),

    CORS_ORIGIN: z.string().default("*"),

    DB_HOST: z.string().optional(),
    DB_PORT: z.coerce.number().default(5432),
    DB_NAME: z.string().optional(),
    DB_USER: z.string().optional(),
    DB_PASSWORD: z.string().optional(),

    LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
  })
  .refine(
    (data) =>
      data.DB_HOST && data.DB_USER && data.DB_PASSWORD && data.DB_NAME,
    {
      message:
        "Missing required database configuration: DB_HOST, DB_USER, DB_PASSWORD, DB_NAME",
    },
  );

/**
 * 環境変数を検証してパース済みデータを返却、検証失敗時はプロセス終了
 */
function validateAndParseEnv() {
  const parseResult = envSchema.safeParse(process.env);

  if (!parseResult.success) {
    logger.error("Environment Configuration Error", {
      issues: parseResult.error.issues,
    });
    process.exit(1);
  }

  return parseResult.data;
}

const parsedEnv = validateAndParseEnv();

/**
 * PostgreSQL接続URLを生成
 */
const buildDatabaseUrl = (): string => {
  const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = parsedEnv;
  return `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;
};

export const isDevelopment = parsedEnv.NODE_ENV === "development";
export const isProduction = parsedEnv.NODE_ENV === "production";
export const isTest = parsedEnv.NODE_ENV === "test";

/**
 * アプリケーション環境設定
 */
export const ENV_CONFIG = Object.freeze({
  isDevelopment,
  isProduction,
  isTest,
  mode: parsedEnv.NODE_ENV,

  server: {
    port: parsedEnv.PORT,
    host: parsedEnv.HOST,
  },

  cors: {
    origin: parsedEnv.CORS_ORIGIN,
  },

  database: {
    url: buildDatabaseUrl(),
    host: parsedEnv.DB_HOST,
    port: parsedEnv.DB_PORT,
    name: parsedEnv.DB_NAME,
    user: parsedEnv.DB_USER,
    password: parsedEnv.DB_PASSWORD,
  },

  logging: {
    level: parsedEnv.LOG_LEVEL,
    debugMode: isDevelopment,
  },
} as const);
