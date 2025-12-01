// Prisma config for version 7.x
// Loads both .env and .env.local files
import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";
import { defineConfig, env } from "prisma/config";

// Load .env first
const myEnv = dotenv.config();
dotenvExpand.expand(myEnv);

// Load .env.local (overrides .env if exists)
const myEnvLocal = dotenv.config({ path: ".env.local" });
dotenvExpand.expand(myEnvLocal);

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
    directUrl: env("DIRECT_URL"),
  },
});
