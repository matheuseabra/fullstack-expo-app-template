---
name: hono-orpc-api
description: Extend the Bun/Hono server and typed oRPC API while preserving auth, CORS, validation, and client contracts.
---

# Hono and oRPC API

Use this skill for changes to `apps/server` or `packages/api`, including routes, procedures, request context, auth integration, and API validation.

## Project conventions

- `apps/server/src/index.ts` owns the Hono HTTP boundary and mounts Better Auth, `/rpc`, and `/api-reference`.
- `packages/api/src/context.ts` resolves the Better Auth session; `packages/api/src/index.ts` defines public and protected procedure helpers.
- Add domain procedures under `packages/api/src/routers`, then expose them through `appRouter`.
- Use Zod input schemas for procedure inputs and preserve the inferred `AppRouterClient` contract consumed by both clients.
- Keep CORS controlled by `CORS_ORIGIN`; never use a wildcard when credentials are enabled.

## Verification

```bash
bun run check-types
bun run build
bun run dev:server
curl http://localhost:3000/
```

For protected procedures, verify an unauthenticated request returns `UNAUTHORIZED`. Do not log cookies, authorization headers, passwords, tokens, or environment values.
