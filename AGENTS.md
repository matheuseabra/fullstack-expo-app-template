# Agent instructions

This repository is a Bun/Turborepo full-stack template. Keep changes small, local to the requested scope, and consistent with the existing package boundaries.

## Read first

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for runtime boundaries and request flows.
- [`DESIGN.md`](DESIGN.md) for visual decisions and UI vocabulary.
- The relevant skill under [`.agent/skills/`](.agent/skills/) before changing a stack area.

## Stack map

- `apps/web`: Vite, React, TanStack Router, shared UI.
- `apps/mobile`: Expo Router, React Native, Uniwind, Better Auth Expo client. Its package name is `native`.
- `apps/server`: Bun, Hono, oRPC and the HTTP/auth entrypoint on port 3000.
- `packages/api`: oRPC procedures, routers, and request context.
- `packages/auth`: Better Auth server configuration and database adapter.
- `packages/db`: Drizzle schema and libSQL client.
- `packages/env`: runtime-specific environment validation.
- `packages/ui`: shared React UI primitives and Tailwind styles.

## Commands

```bash
bun install --frozen-lockfile
bun run check-types
bun run build
bun run db:push
bun run dev
bun run dev:native -- --ios
```

Use separate terminals for `bun run dev:server`, `bun run dev:web`, and the Expo command when only one surface is needed. Copy the three `.env.example` files before running the server or clients; never commit real `.env` files or local databases.

## Change rules

- Keep API contracts in `packages/api`; clients consume the typed router and do not access the database directly.
- Keep authentication configuration in `packages/auth` and environment schemas in `packages/env`.
- Add database tables and relations under `packages/db/src/schema`; apply schema changes with the documented database commands.
- Add web routes under `apps/web/src/routes`; do not edit the generated `routeTree.gen.ts` file.
- Add mobile screens under `apps/mobile/app` using Expo Router conventions.
- Prefer existing shared primitives from `packages/ui` before adding app-specific duplicates.
- Treat `EXPO_PUBLIC_*` and `VITE_*` values as public. Secrets belong only in the server environment.
- Do not add dependencies or abstractions without a concrete use in the requested change.

## Verification

Run the narrowest relevant checks while iterating, then run `bun run check-types` and `bun run build` before handoff. If a change affects the database, also run `bun run db:push` against the configured development database. Report warnings separately from failures.

Do not commit or push unless the user explicitly requests it for the current task.
