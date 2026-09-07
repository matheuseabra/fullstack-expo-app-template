# Offline-first data flow

The mobile app treats its on-device SQLite database as the immediate source of truth for task screens. The server database is the synchronization target, not the UI’s blocking read path.

## Write path

1. A create, toggle, or delete is written to the local database first.
2. Zustand refreshes the visible task list immediately.
3. The operation is appended to the durable sync queue.
4. When connectivity is available, queued operations are pushed to the `/rpc` API backed by the configured server database.
5. A pull upserts remote tasks that have no local pending changes.

The queue uses temporary negative IDs for tasks created offline. After the server accepts a create, the local row and any subsequent queued operations are re-keyed to the server-generated ID. Failed operations remain in the queue with an error and attempt count; a later sync can retry them.

The current pull is additive/upsert-based. It does not yet reconcile a server-side deletion into a local tombstone, so local deletion remains a client-originated queued operation.

## Sync triggers

- on initial app hydration
- after each local mutation
- when the app returns to the foreground
- every 60 seconds while the app is active
- through Expo BackgroundTask with a 15-minute minimum interval when the OS allows it

Background execution is opportunistic: iOS controls the actual schedule and does not support Expo background-task execution in the Simulator. Foreground resume and the durable local queue remain the reliable paths.

Todo procedures are currently public and not user-scoped. Offline-first storage therefore improves responsiveness and resilience but does not provide account isolation; downstream production apps must add ownership and protected procedures before storing private user tasks.

Implementation follows Expo SQLite’s persisted async database APIs and WAL guidance: <https://docs.expo.dev/versions/latest/sdk/sqlite/>.
