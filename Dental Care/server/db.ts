import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

// For this simple app, we don't enforce DATABASE_URL if it's not present,
// we just won't use the DB connection since we are using MemStorage.
// But to keep the structure standard, we define it.

export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL || "postgres://user:password@localhost:5432/db" 
});

// We export db but it might not be connected if DATABASE_URL is missing.
// The application logic in storage.ts will use MemStorage so this is fine.
export const db = drizzle(pool, { schema });
