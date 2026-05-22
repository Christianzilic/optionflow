import { config } from "dotenv";
config({ path: ".env" });
config({ path: ".env.local" });
import { defineConfig } from "prisma/config";

// Migrations use the direct (non-pooled) URL; runtime uses DATABASE_URL via pooler
const migrationUrl = process.env["DIRECT_URL"] ?? process.env["DATABASE_URL"];

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: migrationUrl,
  },
});
