import { defineConfig } from "drizzle-kit";
import { type Config, readConfig } from "./src/config.ts";

export default defineConfig({
  schema: "src/lib/db/schema.ts",
  out: "src/lib/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: readConfig().dbUrl,
  },
});
