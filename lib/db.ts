import fs from "fs/promises";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "panel.json");

type User = { id: string; email: string; passwordHash: string; createdAt: string };
type DB = { users: User[] };

async function read(): Promise<DB> {
  try {
    const raw = await fs.readFile(DB_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    return { users: [] };
  }
}

async function write(db: DB) {
  await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2));
}

export async function findUser(email: string) {
  const db = await read();
  return db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export async function createUser(email: string, passwordHash: string) {
  const db = await read();
  if (db.users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error("email already exists");
  }
  const user: User = {
    id: crypto.randomUUID(),
    email,
    passwordHash,
    createdAt: new Date().toISOString(),
  };
  db.users.push(user);
  await write(db);
  return user;
}
