import { dbURL } from "@repo/config-static";
import { drizzle } from "drizzle-orm/node-postgres";

export const db = drizzle(dbURL);
