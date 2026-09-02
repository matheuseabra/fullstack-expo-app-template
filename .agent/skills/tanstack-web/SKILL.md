---
name: tanstack-web
description: Build the Vite/React web app with TanStack Router, typed oRPC clients, and shared UI components.
---

# TanStack web

Use this skill for changes under `apps/web`, including routes, loaders, auth guards, client data access, and browser UI.

## Project conventions

- Routes are file-based under `apps/web/src/routes`; the generated `routeTree.gen.ts` must not be edited manually.
- The protected route boundary is `apps/web/src/routes/_auth/route.tsx`; keep auth checks at the route boundary.
- Use `apps/web/src/utils/orpc.ts` for typed API calls and `apps/web/src/lib/auth-client.ts` for Better Auth.
- `VITE_SERVER_URL` is public configuration loaded from `apps/web/.env`.
- Prefer `packages/ui` primitives and `DESIGN.md` tokens over local component duplication.

## Verification

```bash
cd apps/web && bun run check-types
bun run check-types
bun run build
```

Check loading, empty, error, and authenticated states when changing a route or data query. Keep browser credentials configured with `credentials: "include"` for auth requests.
