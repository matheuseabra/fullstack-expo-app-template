import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
	clientPrefix: "EXPO_PUBLIC_",
	client: {
		EXPO_PUBLIC_SERVER_URL: z.url(),
		EXPO_PUBLIC_IAP_PRODUCT_ID: z.string().min(1).default("com.daymark.plus.monthly"),
	},
	runtimeEnv: {
		EXPO_PUBLIC_SERVER_URL: process.env.EXPO_PUBLIC_SERVER_URL,
		EXPO_PUBLIC_IAP_PRODUCT_ID: process.env.EXPO_PUBLIC_IAP_PRODUCT_ID,
	},
	emptyStringAsUndefined: true,
});
