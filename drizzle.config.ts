import { defineConfig } from "drizzle-kit";
import { type Config, readConfig } from "./src/config.ts";

export default defineConfig({
  schema: "src/lib/schema/schema.ts",
  out: "src/lib/schema/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: readConfig().dbUrl,
  },
});
