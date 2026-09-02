# Mobile functionality

The mobile app is a client of the Hono/oRPC API. Task records are stored in the LibSQL database configured by `apps/server/.env`; the mobile app does not keep a second task store.

## Working end to end

- Today loads tasks from `todo.getAll`, calculates progress from returned records, creates tasks through `todo.create`, and toggles completion through `todo.toggle`.
- Tasks loads the same records and supports create, toggle, delete, loading states, and retry states.
- Week loads the same records and calculates the current Monday–Sunday summary from each task’s server-generated `createdAt` timestamp.
- The shared `apps/mobile/hooks/use-todos.ts` keeps Today and Tasks on the same query and mutation behavior.

Apply the schema before starting the API:

```bash
bun run db:push
bun run dev:server
```

Then start Expo with `EXPO_PUBLIC_SERVER_URL` pointing at the API, as shown in `apps/mobile/.env.example`.

## Presentational or intentionally limited

- Settings is a visual shell for the product preferences. Notifications, week-start preferences, and account controls do not have a persistence contract yet, so the screen does not claim to save them.
- The task router is currently public and therefore not user-scoped. This is suitable for local development, but a production app should associate tasks with the authenticated user and protect the procedures before deployment.
- Authentication primitives exist through Better Auth, but the default task experience does not require sign-in. A future authenticated product flow should add the session boundary and migrate existing task ownership deliberately.

## Verification checklist

1. Create a task from Today or Tasks.
2. Toggle it from either screen and confirm the count changes after the API refresh.
3. Delete it from Tasks and confirm it disappears from Today and Week.
4. Restart the API or reload the app and confirm the record remains in the database.
