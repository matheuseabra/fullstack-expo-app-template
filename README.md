# fullstack-expo-app-template

[![CI](https://github.com/matheuseabra/fullstack-expo-app-template/actions/workflows/ci.yml/badge.svg)](https://github.com/matheuseabra/fullstack-expo-app-template/actions/workflows/ci.yml) [![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/matheuseabra/fullstack-expo-app-template/releases) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A Bun/Turborepo starter for a consumer mobile app. The current reference implementation is Daymark: an Expo Router task companion with local-first SQLite storage, a Bun/Hono/oRPC server, Better Auth, RevenueCat subscription plumbing, a Drizzle/libSQL database, and a marketing-only Vite/TanStack Router web surface.

The web app presents the mobile product and does not provide web task editing. The mobile task experience is local-first: Today, Week, and Search read the on-device SQLite store, while queued changes synchronize with the server when connectivity is available.

## Requirements

- [Bun](https://bun.sh/) 1.4.0
- Xcode and an iOS Simulator for iOS development
- Android Studio and an Android emulator/device for Android development
- Docker Desktop only if you want to run the server in Docker
- The Turso CLI only if you use the optional `db:local` command

## Setup

The Expo compatibility patch at `patches/expo-modules-jsi@57.0.8.patch` is tracked because Bun needs it during a frozen install. `.agents/` remains local-only and ignored by Git.

After the local patch is available, install dependencies and create runtime environment files:

```bash
bun install --frozen-lockfile
cp apps/server/.env.example apps/server/.env
cp apps/web/.env.example apps/web/.env
cp apps/mobile/.env.example apps/mobile/.env
```

Set `BETTER_AUTH_SECRET` in `apps/server/.env` to a random value of at least 32 characters:

```bash
openssl rand -base64 32
```

The server example uses a local SQLite-compatible libSQL file at `apps/server/local.db`. Apply the schema once:

```bash
bun run db:push
```

For real RevenueCat store work, replace the placeholder public SDK keys in `apps/mobile/.env` with the iOS and Android keys from the RevenueCat project. These are public client values; keep `REVENUECAT_WEBHOOK_SECRET` server-only. Store setup and development-build requirements are documented in [`docs/IAP.md`](docs/IAP.md).

## Development

Start the server, marketing site, and Expo development server through Turborepo:

```bash
bun run dev
```

The local surfaces are:

- API health check: <http://localhost:3000/>
- API reference: <http://localhost:3000/api-reference>
- Marketing site: <http://localhost:3001>
- Expo Metro: usually `:8081`

For focused work, run services in separate terminals:

```bash
bun run dev:server              # Bun/Hono API on :3000
bun run dev:web                 # Vite marketing site on :3001
bun run dev:native -- --ios     # Expo and iOS Simulator
```

The native workspace package is named `native` for Turborepo compatibility even though its source lives in `apps/mobile`. Expo reads `EXPO_PUBLIC_SERVER_URL` and the RevenueCat public keys from `apps/mobile/.env`.

The mobile app does not require sign-in for its default task flow. Better Auth primitives and sign-in/sign-up components exist, but the current todo procedures are public and not user-scoped. Add ownership and protected procedures before using the example for private user data.

## Database commands

```bash
bun run db:push      # Apply the current Drizzle schema
bun run db:generate  # Generate a migration
bun run db:migrate   # Apply migrations
bun run db:studio    # Open Drizzle Studio
bun run db:local     # Optional Turso local-dev database
```

The default development database is selected by `DATABASE_URL=file:../../apps/server/local.db` in `apps/server/.env`. For a hosted Turso database, replace `DATABASE_URL` and `DATABASE_AUTH_TOKEN` with the hosted values. The database contains Better Auth tables, todo data, and persisted RevenueCat entitlement state.

## Docker

Docker Compose builds and runs the server only:

```bash
bun run docker:build
bun run docker:up
bun run docker:logs
bun run docker:down
```

Compose reads `apps/server/.env` and exposes the server on port `3000`. Use a hosted database or provide deployment-appropriate database configuration; do not commit a local database file.

## Project structure

```text
.
├── .github/workflows/ci.yml
├── apps/
│   ├── mobile/              # Expo Router / React Native Daymark app
│   ├── server/              # Bun / Hono HTTP and webhook server
│   └── web/                 # Vite / TanStack Router marketing site only
├── docs/
│   ├── ARCHITECTURE.md      # Runtime boundaries and request/sync flows
│   ├── DESIGN.md            # Shared visual language and implementation ownership
│   ├── IAP.md               # RevenueCat setup and entitlement flow
│   ├── MOBILE_FUNCTIONALITY.md
│   ├── MOBILE_VISUAL_SYSTEM.md
│   ├── OFFLINE_FIRST.md
│   ├── SECURITY.md
│   └── VISION.md
├── packages/
│   ├── api/                 # oRPC context and routers
│   ├── auth/                # Better Auth server configuration
│   ├── config/              # Shared TypeScript configuration
│   ├── db/                  # Drizzle schema and libSQL client
│   ├── env/                 # Server, web, and native environment validation
│   └── ui/                  # Web-oriented shared UI primitives and styles
├── AGENTS.md
├── LICENSE
├── README.md
├── bun.lock
├── docker-compose.yml
├── package.json
└── turbo.json
```

Ignored local paths include `.agents/`, `.env` files, local databases, Expo prebuild output, dependencies, and build output. The native compatibility patch under `/patches/` is intentionally tracked. Do not place credentials or private keys in public `EXPO_PUBLIC_*` or `VITE_*` variables. See [`docs/SECURITY.md`](docs/SECURITY.md).

## Documentation

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — package boundaries, HTTP endpoints, and native sync flow.
- [`docs/MOBILE_FUNCTIONALITY.md`](docs/MOBILE_FUNCTIONALITY.md) — current mobile behavior and verification checklist.
- [`docs/OFFLINE_FIRST.md`](docs/OFFLINE_FIRST.md) — local SQLite, queue, and reconciliation behavior.
- [`docs/DESIGN.md`](docs/DESIGN.md) and [`docs/MOBILE_VISUAL_SYSTEM.md`](docs/MOBILE_VISUAL_SYSTEM.md) — visual rules and surface ownership.
- [`docs/IAP.md`](docs/IAP.md) — RevenueCat development-build, store, webhook, and entitlement guidance.
- [`AGENTS.md`](AGENTS.md) — repository operating instructions for contributors and agents.

## Quality checks

Run the workspace checks locally:

```bash
bun run check-types
bun run build
```

CI currently runs `bun run check-types`. There is no automated application test suite in the workspace yet; verify native task, offline-sync, authentication, and purchase behavior on the relevant development surface when changing those flows.
