import { dbURL } from "@repo/static-config";
import { drizzle } from "drizzle-orm/node-postgres";

export const db = drizzle(dbURL);
