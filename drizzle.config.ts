import type { Config } from "drizzle-kit"

export default {
  schema: "./src/lib/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
  dbCredentials: {
    url: process.env.DATABASE_PATH ?? "./data/cleaning.db",
  },
} satisfies Config
