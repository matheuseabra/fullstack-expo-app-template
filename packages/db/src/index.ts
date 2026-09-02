import { env } from "@fullstack-expo-app-template/env/server";
import * as schema from "./schema";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

export function createDb() {
	const client = createClient({
		url: env.DATABASE_URL,
		authToken: env.DATABASE_AUTH_TOKEN,
	});

	return drizzle({ client, schema });
}

export const db = createDb();
