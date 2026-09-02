# fullstack-expo-app-template

[![CI](https://github.com/matheuseabra/fullstack-expo-app-template/actions/workflows/ci.yml/badge.svg)](https://github.com/matheuseabra/fullstack-expo-app-template/actions/workflows/ci.yml) [![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/matheuseabra/fullstack-expo-app-template/releases) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A Bun/Turborepo full-stack template with a TanStack Router web app, Expo mobile app, Hono API, oRPC, Drizzle/libSQL, Better Auth, and shared UI components.

## Requirements

- [Bun](https://bun.sh/) 1.4.0
- Xcode and an iOS Simulator for iOS development
- Docker Desktop only if you want to run the server in Docker

## Setup

Install dependencies and create local environment files:

```bash
bun install
cp apps/server/.env.example apps/server/.env
cp apps/web/.env.example apps/web/.env
cp apps/mobile/.env.example apps/mobile/.env
```

Replace `BETTER_AUTH_SECRET` in `apps/server/.env` with a random value of at least 32 characters. For example:

```bash
openssl rand -base64 32
```

The example server configuration uses a local SQLite-compatible libSQL database at `apps/server/local.db`. Apply the schema once:

```bash
bun run db:push
```

## Development

Start the API, web app, and Expo development server together:

```bash
bun run dev
```

Or run only the services you need in separate terminals:

```bash
bun run dev:server  # http://localhost:3000
bun run dev:web     # http://localhost:3001
```

To start Expo and open the iOS Simulator:

```bash
bun run dev:native -- --ios
```

The mobile app lives in `apps/mobile`; its workspace package name is `native` for compatibility with the generated Turborepo scripts. Expo loads `EXPO_PUBLIC_SERVER_URL` from `apps/mobile/.env`.

## Database commands

```bash
bun run db:push      # Apply the current schema
bun run db:generate  # Generate a migration
bun run db:migrate   # Apply migrations
bun run db:studio    # Open Drizzle Studio
```

For a hosted Turso database, replace `DATABASE_URL` and `DATABASE_AUTH_TOKEN` in `apps/server/.env` with the values for that database.

## Docker

The server can be built and started with Docker Compose:

```bash
bun run docker:build
bun run docker:up
bun run docker:logs
bun run docker:down
```

Docker Compose reads `apps/server/.env`. Use a hosted database or provide a database volume/configuration appropriate for your deployment rather than committing a local database file.

## Project structure

```text
apps/
  mobile/   Expo / React Native app
  server/   Hono API server
  web/      TanStack Router web app
packages/
  api/      oRPC routers and application context
  auth/     Better Auth configuration
  config/   Shared TypeScript configuration
  db/       Drizzle schema and database client
  env/      Runtime environment validation
  ui/       Shared UI components and styles
```

## Quality checks

Run the same checks used by CI:

```bash
bun run check-types
```

Environment files, local databases, Expo prebuild output, dependencies, build output, and credentials are excluded by `.gitignore`. See [SECURITY.md](SECURITY.md) before sharing or deploying the project.
