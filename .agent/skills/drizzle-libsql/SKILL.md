---
name: drizzle-libsql
description: Modify the Drizzle schema, Better Auth tables, libSQL client, or database workflow used by the server.
---

# Drizzle and libSQL

Use this skill for changes under `packages/db`, auth persistence, schema design, migrations, or local/Turso database setup.

## Project conventions

- Schemas live in `packages/db/src/schema`; export new tables from the relevant schema index.
- `packages/db/src/index.ts` is the single Drizzle/libSQL client factory used by the application.
- Better Auth tables are in `packages/db/src/schema/auth.ts`; application tables should remain separate.
- Development defaults use `DATABASE_URL=file:../../apps/server/local.db` and a local placeholder auth token. Production should use hosted Turso/libSQL credentials.

## Workflow

```bash
bun run db:push
bun run db:generate
bun run db:migrate
bun run check-types
```

Use `db:push` for local schema iteration. Generate and review migrations before committing changes intended for deployment. Never commit local database files or database credentials.
