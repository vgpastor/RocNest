// Prisma config for version 7.x
// Loads both .env and .env.local files
import { config } from "dotenv";
import { defineConfig, env } from "prisma/config";

// Cargar .env primero (valores por defecto)
config({ path: ".env" });
// Cargar .env.local después (sobreescribe .env)
config({ path: ".env.local", override: true });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
