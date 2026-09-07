# Mobile functionality

The mobile app is an offline-first client of the Hono/oRPC API. Its task screens read from the on-device SQLite database first; the sync layer later pushes queued operations to the server database configured by `apps/server/.env`.

## Working end to end

- Today reads local tasks, shows open tasks, calculates progress, and lets the user complete a task.
- Search reads the same local task list, filters open tasks by text, and lets the user complete a result.
- Week reads the same local task list and calculates a Monday–Sunday summary from each task’s local or server-provided `createdAt` timestamp. It supports calendar and list views.
- The add-task sheet writes a new task locally first. `apps/mobile/stores/todo-store.ts` refreshes the UI immediately and starts synchronization in the background.
- `apps/mobile/hooks/use-todos.ts` is a small façade over the Zustand store; it is not a remote query cache for tasks.

The API procedures used by synchronization are `todo.getAll`, `todo.create`, `todo.toggle`, and `todo.delete`. They are currently public and therefore not user-scoped. The local storage layer supports deletion and the API exposes it, but no current mobile screen presents a delete action.

Apply the schema before starting the API:

```bash
bun run db:push
bun run dev:server
```

Then start Expo with `EXPO_PUBLIC_SERVER_URL` pointing at the API, as shown in `apps/mobile/.env.example`.

## Presentational or intentionally limited

- Settings is a visual shell for Notifications, Week starts on, and Appearance; those preference rows do not persist a setting yet.
- Settings legal links open the configured Terms of Service and Privacy Policy URLs in the system browser.
- Reset onboarding is a working developer action that clears the local onboarding flag and returns to onboarding.
- Authentication primitives exist through Better Auth, but the default task experience does not require sign-in. The current task procedures remain public and do not isolate users.
- RevenueCat entitlement status can be read for signed-in users through the protected `subscription.status` procedure, but no task-creation limit or other premium feature is currently enforced by the API or mobile task flow.

## Verification checklist

1. Launch the app and create a task from Today or Search’s add-task action.
2. Confirm the task appears immediately, including with the network unavailable.
3. Complete it from Today or Search and confirm it leaves the open-task lists while Week counts it as complete.
4. Restart the app and confirm the task remains in the device’s local SQLite store.
5. Restore connectivity, allow synchronization to run, and confirm the server-backed copy is returned by `todo.getAll`.
6. If testing server synchronization, remember that the current public todo procedures share records across clients and users.
