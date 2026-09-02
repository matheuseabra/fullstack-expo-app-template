# Architecture

## Overview

The repository is a workspace of two clients, one HTTP server, and shared packages. Both clients call the same typed oRPC procedures and Better Auth endpoints; only the server-side packages talk to the database.

```mermaid
%%{init: {"flowchart": {"curve": "linear"}, "themeVariables": {"lineColor": "#888888"}}}%%
flowchart LR
    Web[apps/web\nVite + React] -->|RPC and auth HTTP| Server[apps/server\nBun + Hono]
    Mobile[apps/mobile\nExpo Router] -->|RPC and auth HTTP| Server
    Server --> API[packages/api\noRPC routers and context]
    Server --> Auth[packages/auth\nBetter Auth]
    API --> Auth
    API --> DB[packages/db\nDrizzle + libSQL client]
    Auth --> DB
    DB --> Store[(SQLite-compatible libSQL\nlocal file or Turso)]
    UI[packages/ui\nshared primitives] --> Web
    Env[packages/env\nserver / web / native validation] --> Web
    Env --> Mobile
    Env --> Server
    linkStyle default stroke-width:1px,fill:none
```

## Workspace dependency direction

```mermaid
%%{init: {"flowchart": {"curve": "linear"}, "themeVariables": {"lineColor": "#888888"}}}%%
flowchart TD
    Root[Root workspace\nBun + Turborepo]
    Root --> Web[apps/web]
    Root --> Mobile[apps/mobile]
    Root --> Server[apps/server]
    Web --> UI[packages/ui]
    Web --> API[packages/api]
    Web --> Env[packages/env]
    Mobile --> API
    Mobile --> Env
    Server --> API
    Server --> Auth[packages/auth]
    Server --> Env
    API --> Auth
    API --> DB[packages/db]
    Auth --> DB
    Auth --> Env
    DB --> Env
    linkStyle default stroke-width:1px,fill:none
```

The dependency direction is intentionally simple: clients depend on typed contracts, the server composes the HTTP boundary, and persistence stays behind `packages/db`.

## HTTP request flow

```mermaid
sequenceDiagram
    participant C as Web or mobile client
    participant H as Hono server
    participant A as Better Auth
    participant R as oRPC handler
    participant P as API procedure
    participant D as Drizzle/libSQL

    C->>H: Request /api/auth/* or /rpc/*
    alt Better Auth route
        H->>A: Forward auth request
        A->>D: Read or write user/session data
        D-->>A: Persistence result
        A-->>C: Session response and cookie
    else oRPC route
        H->>A: Resolve session from request headers
        A->>D: Read session data
        D-->>A: Session result
        H->>R: Match /rpc prefix with context
        R->>P: Validate input and run procedure
        P->>D: Query or mutate application data
        D-->>P: Typed result
        P-->>C: Typed oRPC response
    end
```

`publicProcedure` is available without a session. `protectedProcedure` applies the session middleware and throws `UNAUTHORIZED` when no authenticated user is present. The current todo procedures are public; private application procedures should use the protected variant.

## Runtime configuration

Each runtime validates only its own environment surface:

- Server: `DATABASE_URL`, `DATABASE_AUTH_TOKEN`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, and `CORS_ORIGIN`.
- Web: `VITE_SERVER_URL`.
- Native: `EXPO_PUBLIC_SERVER_URL`.

The server loads `apps/server/.env` through `dotenv`. Vite loads `apps/web/.env`, and Expo loads `apps/mobile/.env`. Public client variables must never contain credentials.

## Development topology

```mermaid
%%{init: {"flowchart": {"curve": "linear"}, "themeVariables": {"lineColor": "#888888"}}}%%
flowchart LR
    Dev[Developer shell] --> Turbo[bun run dev]
    Turbo --> Web[Web :3001]
    Turbo --> API[API :3000]
    Turbo --> Metro[Expo Metro :8081]
    Metro --> Sim[iOS Simulator or Expo Go]
    API --> Local[(apps/server/local.db)]
    linkStyle default stroke-width:1px,fill:none
```

For a production-like server, the `apps/server/Dockerfile` builds the server bundle and Docker Compose supplies runtime environment variables. A hosted Turso/libSQL database should be used for deployed workloads.

## Change seams

| Concern | Change here | Avoid changing |
| --- | --- | --- |
| Screen and route UI | `apps/web/src/routes`, `apps/mobile/app` | API or database internals |
| Shared visual primitives | `packages/ui` and `docs/DESIGN.md` | Duplicating primitives in each app |
| Client/server contract | `packages/api/src/routers` | Ad hoc fetch shapes in clients |
| Authentication | `packages/auth`, auth clients | Reading session data directly from the database |
| Persistence | `packages/db/src/schema` and migrations | Embedding SQL in route components |
| Runtime configuration | `packages/env` and app `.env.example` files | Exposing server secrets to clients |
