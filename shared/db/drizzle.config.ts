import { defineConfig } from "drizzle-kit";
import { dbURL } from "@repo/static-config";

export default defineConfig({
	out: "./drizzle",
	schema: "./src/schema/index.ts",
	dialect: "postgresql",
	dbCredentials: { url: dbURL! },
});
