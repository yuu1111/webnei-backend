import postgres from "postgres";
import { ENV_CONFIG } from "../config/env.config";

export const sql = postgres(ENV_CONFIG.database.url, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

export type SQL = typeof sql;
