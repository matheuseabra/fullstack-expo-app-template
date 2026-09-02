import * as Network from "expo-network";
import * as SQLite from "expo-sqlite";
import { client } from "@/utils/orpc";

export type Todo = {
  id: number;
  text: string;
  completed: boolean;
  createdAt: number | null;
};

type SyncOperation = "create" | "toggle" | "delete";
type SyncQueueRow = { id: number; operation: SyncOperation; local_id: number; payload: string };
type LocalTodoRow = TodoRow & { sync_state: string; deleted: number };
type TodoRow = { id: number; text: string; completed: number; created_at: number | null };
type TodoPayload = { text?: string; completed?: boolean };
type RemoteTodo = Todo;

const DATABASE_NAME = "daymark.db";
let databasePromise: Promise<SQLite.SQLiteDatabase> | undefined;
let localIdSequence = 0;
let syncPromise: Promise<SyncResult> | undefined;

export type SyncResult = "synced" | "offline";

function database() {
  databasePromise ??= SQLite.openDatabaseAsync(DATABASE_NAME);
  return databasePromise;
}

export async function initializeLocalDb() {
  const db = await database();
  await db.execAsync(
    "PRAGMA journal_mode = WAL;" +
      "CREATE TABLE IF NOT EXISTS todos (" +
      "id INTEGER PRIMARY KEY NOT NULL," +
      "text TEXT NOT NULL," +
      "completed INTEGER NOT NULL DEFAULT 0," +
      "created_at INTEGER," +
      "sync_state TEXT NOT NULL DEFAULT 'synced'," +
      "deleted INTEGER NOT NULL DEFAULT 0," +
      "updated_at INTEGER NOT NULL" +
      ");" +
      "CREATE TABLE IF NOT EXISTS sync_queue (" +
      "id INTEGER PRIMARY KEY AUTOINCREMENT," +
      "operation TEXT NOT NULL," +
      "local_id INTEGER NOT NULL," +
      "payload TEXT NOT NULL," +
      "created_at INTEGER NOT NULL," +
      "attempts INTEGER NOT NULL DEFAULT 0," +
      "last_error TEXT" +
      ");" +
      "CREATE INDEX IF NOT EXISTS sync_queue_created_at_idx ON sync_queue (created_at, id);",
  );
  return db;
}

function toTodo(row: TodoRow): Todo {
  return { id: row.id, text: row.text, completed: row.completed === 1, createdAt: row.created_at };
}

export async function listLocalTodos() {
  const db = await initializeLocalDb();
  const rows = await db.getAllAsync<TodoRow>("SELECT id, text, completed, created_at FROM todos WHERE deleted = 0 ORDER BY created_at ASC, id ASC");
  return rows.map(toTodo);
}

function nextLocalId() {
  localIdSequence += 1;
  return -(Date.now() * 100 + localIdSequence);
}

async function enqueue(db: SQLite.SQLiteDatabase, operation: SyncOperation, localId: number, payload: TodoPayload) {
  await db.runAsync(
    "INSERT INTO sync_queue (operation, local_id, payload, created_at) VALUES (?, ?, ?, ?)",
    operation,
    localId,
    JSON.stringify(payload),
    Date.now(),
  );
}

export async function createLocalTodo(text: string) {
  const db = await initializeLocalDb();
  const id = nextLocalId();
  const now = Date.now();
  await db.runAsync(
    "INSERT INTO todos (id, text, completed, created_at, sync_state, updated_at) VALUES (?, ?, 0, ?, 'pending', ?)",
    id,
    text,
    now,
    now,
  );
  await enqueue(db, "create", id, { text });
}

export async function toggleLocalTodo(id: number, completed: boolean) {
  const db = await initializeLocalDb();
  await db.runAsync("UPDATE todos SET completed = ?, sync_state = 'pending', updated_at = ? WHERE id = ?", completed ? 1 : 0, Date.now(), id);
  await enqueue(db, "toggle", id, { completed });
}

export async function deleteLocalTodo(id: number) {
  const db = await initializeLocalDb();
  await db.runAsync("UPDATE todos SET deleted = 1, sync_state = 'pending', updated_at = ? WHERE id = ?", Date.now(), id);
  await enqueue(db, "delete", id, {});
}

function parsePayload(payload: string) {
  return JSON.parse(payload) as TodoPayload;
}

async function markSyncedIfIdle(db: SQLite.SQLiteDatabase, localId: number) {
  await db.runAsync(
    "UPDATE todos SET sync_state = 'synced', updated_at = ? WHERE id = ? AND NOT EXISTS (SELECT 1 FROM sync_queue WHERE local_id = ?)",
    Date.now(),
    localId,
    localId,
  );
}

async function pushCreate(db: SQLite.SQLiteDatabase, item: SyncQueueRow) {
  const payload = parsePayload(item.payload);
  if (!payload.text) throw new Error("Queued task is missing text");
  const remote = await client.todo.create({ text: payload.text }) as RemoteTodo;
  if (!remote?.id) throw new Error("Server did not return the created task");
  await db.runAsync("UPDATE todos SET id = ?, sync_state = 'synced', updated_at = ? WHERE id = ?", remote.id, Date.now(), item.local_id);
  await db.runAsync("UPDATE sync_queue SET local_id = ? WHERE local_id = ?", remote.id, item.local_id);
}

async function pushToggle(item: SyncQueueRow) {
  const payload = parsePayload(item.payload);
  await client.todo.toggle({ id: item.local_id, completed: Boolean(payload.completed) });
}

async function pushDelete(db: SQLite.SQLiteDatabase, item: SyncQueueRow) {
  if (item.local_id > 0) await client.todo.delete({ id: item.local_id });
  await db.runAsync("DELETE FROM todos WHERE id = ?", item.local_id);
}

async function pushQueueItem(db: SQLite.SQLiteDatabase, item: SyncQueueRow) {
  try {
    if (item.operation === "create") await pushCreate(db, item);
    if (item.operation === "toggle") await pushToggle(item);
    if (item.operation === "delete") await pushDelete(db, item);
    await db.runAsync("DELETE FROM sync_queue WHERE id = ?", item.id);
    if (item.operation !== "delete") await markSyncedIfIdle(db, item.local_id);
  } catch (error) {
    await db.runAsync("UPDATE sync_queue SET attempts = attempts + 1, last_error = ? WHERE id = ?", String(error), item.id);
    await db.runAsync("UPDATE todos SET sync_state = 'failed' WHERE id = ?", item.local_id);
    throw error;
  }
}

async function pullRemoteTodos(db: SQLite.SQLiteDatabase) {
  const remoteTodos = await client.todo.getAll() as RemoteTodo[];
  for (const remote of remoteTodos) {
    const local = await db.getFirstAsync<Pick<LocalTodoRow, "sync_state" | "deleted">>("SELECT sync_state, deleted FROM todos WHERE id = ?", remote.id);
    if (local && (local.deleted === 1 || local.sync_state !== "synced")) continue;
    await db.runAsync(
      "INSERT INTO todos (id, text, completed, created_at, sync_state, deleted, updated_at) " +
        "VALUES (?, ?, ?, ?, 'synced', 0, ?) " +
        "ON CONFLICT(id) DO UPDATE SET text = excluded.text, completed = excluded.completed, created_at = excluded.created_at, updated_at = excluded.updated_at",
      remote.id,
      remote.text,
      remote.completed ? 1 : 0,
      remote.createdAt,
      Date.now(),
    );
  }
}

async function performSync(): Promise<SyncResult> {
  const db = await initializeLocalDb();
  const network = await Network.getNetworkStateAsync();
  if (!network.isConnected) return "offline";
  const queue = await db.getAllAsync<SyncQueueRow>("SELECT id, operation, local_id, payload FROM sync_queue ORDER BY created_at ASC, id ASC");
  for (const item of queue) await pushQueueItem(db, item);
  await pullRemoteTodos(db);
  return "synced";
}

export function syncLocalTodos() {
  syncPromise ??= performSync().finally(() => {
    syncPromise = undefined;
  });
  return syncPromise;
}
