
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { env } from "@fullstack-expo-app-template/env/server";
import { createDb } from "@fullstack-expo-app-template/db";
import * as schema from "@fullstack-expo-app-template/db/schema/auth";
import { expo } from "@better-auth/expo";

export function createAuth() {
	const db = createDb();

	return betterAuth({
		database: drizzleAdapter(db, {

provider: "sqlite",

			schema: schema,
		}),
		trustedOrigins: [
			env.CORS_ORIGIN,

			"fullstack-expo-app-template://",
			"exp://",
			"http://localhost:8081",
		],
		emailAndPassword: {
			enabled: true,
		},
		secret: env.BETTER_AUTH_SECRET,
		baseURL: env.BETTER_AUTH_URL,
		advanced: {
			defaultCookieAttributes: {
				sameSite: "none",
				secure: true,
				httpOnly: true,
			},
		},
		plugins: [
            expo()
        ],
	});
}

export const auth = createAuth();



