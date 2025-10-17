import { dbURL } from "@repo/config-static";
import { drizzle } from "drizzle-orm/node-postgres";

import { Pool } from "pg";
import * as schema from "./schema"; // Import your schema

const pool = new Pool({ connectionString: dbURL });

export const db = drizzle(pool, { schema });
