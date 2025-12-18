import postgres from "postgres";

const connectionString =
  process.env.DATABASE_URL ||
  "postgres://postgres:pass@localhost:5432/nesql-repository";

export const sql = postgres(connectionString, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

export type SQL = typeof sql;
