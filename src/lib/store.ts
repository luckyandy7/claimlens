import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { randomBytes, randomUUID, createHash } from "node:crypto";
import type { Claim } from "./domain";
const g = globalThis as unknown as { claimDb?: DatabaseSync };
function connection() {
  if (g.claimDb) return g.claimDb;
  const dir = join(process.cwd(), ".data");
  mkdirSync(dir, { recursive: true });
  const connection = new DatabaseSync(join(dir, "claims.sqlite"));
  connection.exec(
    "PRAGMA busy_timeout=5000; PRAGMA journal_mode=WAL; CREATE TABLE IF NOT EXISTS sessions (token TEXT PRIMARY KEY, org TEXT, expires INTEGER); CREATE TABLE IF NOT EXISTS claims (id TEXT PRIMARY KEY, org TEXT, data TEXT); CREATE TABLE IF NOT EXISTS captures (token TEXT PRIMARY KEY, claim_id TEXT, expires INTEGER, used INTEGER DEFAULT 0); CREATE TABLE IF NOT EXISTS assets (id TEXT PRIMARY KEY, claim_id TEXT, content BLOB, type TEXT);",
  );
  g.claimDb = connection;
  return connection;
}
export const db = new Proxy({} as DatabaseSync, {
  get(_target, key) {
    const instance = connection();
    const value = Reflect.get(instance, key);
    return typeof value === "function" ? value.bind(instance) : value;
  },
});
export const hash = (v: string) => createHash("sha256").update(v).digest("hex");
export function createSession() {
  const token = randomBytes(32).toString("hex");
  const org = randomUUID();
  db.prepare("INSERT INTO sessions VALUES (?,?,?)").run(
    hash(token),
    org,
    Date.now() + 7 * 86400000,
  );
  const now = new Date().toISOString();
  const c: Claim = {
    id: randomUUID(),
    order: "CL-2026-1108",
    product: "에센셜 헤드폰 · 스톤",
    customer: "김민서 (샘플)",
    reason: "제품 외관의 상태를 확인하고 싶어요.",
    status: "in_review",
    createdAt: now,
    version: 1,
    note: "",
    assets: [
      {
        id: "sample-out",
        side: "outgoing",
        label: "출고 상태 · 예시 이미지",
        url: "/headphone.svg",
        createdAt: now,
      },
      {
        id: "sample-in",
        side: "incoming",
        label: "접수 상태 · 예시 이미지",
        url: "/headphone.svg",
        createdAt: now,
      },
    ],
    events: [{ text: "예시 자료로 생성된 데모 접수입니다.", at: now }],
  };
  db.prepare("INSERT INTO claims VALUES (?,?,?)").run(
    c.id,
    org,
    JSON.stringify(c),
  );
  return token;
}
export function orgFor(token: string | undefined) {
  if (!token) return null;
  const row = db
    .prepare("SELECT org FROM sessions WHERE token=? AND expires>?")
    .get(hash(token), Date.now()) as { org: string } | undefined;
  return row?.org ?? null;
}
export function getClaim(id: string, org?: string) {
  const row = (
    org
      ? db.prepare("SELECT data FROM claims WHERE id=? AND org=?").get(id, org)
      : db.prepare("SELECT data FROM claims WHERE id=?").get(id)
  ) as { data: string } | undefined;
  return row ? (JSON.parse(row.data) as Claim) : null;
}
export function listClaims(org: string) {
  return (
    db
      .prepare("SELECT data FROM claims WHERE org=? ORDER BY rowid DESC")
      .all(org) as { data: string }[]
  ).map((r) => JSON.parse(r.data) as Claim);
}
export function saveClaim(c: Claim) {
  db.prepare("UPDATE claims SET data=? WHERE id=?").run(
    JSON.stringify(c),
    c.id,
  );
}
export function newCapture(id: string) {
  const token = randomBytes(24).toString("hex");
  db.prepare("UPDATE captures SET used=1 WHERE claim_id=?").run(id);
  db.prepare("INSERT INTO captures VALUES (?,?,?,0)").run(
    hash(token),
    id,
    Date.now() + 72 * 3600000,
  );
  return token;
}
export function captureFor(token: string) {
  return db
    .prepare("SELECT claim_id,used FROM captures WHERE token=? AND expires>?")
    .get(hash(token), Date.now()) as
    { claim_id: string; used: number } | undefined;
}
