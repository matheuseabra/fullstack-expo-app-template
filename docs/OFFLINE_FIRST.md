# Offline-first data flow

Daymark treats the on-device SQLite database as the immediate source of truth for tasks.

## Write path

1. A create, toggle, or delete is written to the local database first.
2. Zustand refreshes the visible task list immediately.
3. The operation is appended to the sync queue.
4. When connectivity is available, queued operations are pushed to the oRPC API backed by Turso.
5. A pull reconciles remote tasks that have no local pending changes.

The queue uses temporary negative IDs for tasks created offline. After the server accepts a create, the local row and any subsequent queued operations are re-keyed to the Turso-generated ID.

## Sync triggers

- on initial app hydration
- after each local mutation
- when the app returns to the foreground
- every 60 seconds while the app is active
- through Expo BackgroundTask with a 15-minute minimum interval when the OS allows it

Background execution is opportunistic: iOS controls the actual schedule and does not support Expo background-task execution in the Simulator. Foreground resume and the local queue remain the reliable paths.

Implementation follows Expo SQLite’s persisted async database APIs and WAL guidance: <https://docs.expo.dev/versions/latest/sdk/sqlite/>.
