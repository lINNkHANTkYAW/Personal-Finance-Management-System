import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { getPool } from "./postgres";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

function mapUser(row: Record<string, unknown>): AuthUser {
  return {
    id: row.id as string,
    email: row.email as string,
    name: row.name as string,
    createdAt: new Date(row.created_at as string).toISOString(),
  };
}

export async function findUserByEmail(email: string): Promise<
  (AuthUser & { passwordHash: string }) | null
> {
  const db = getPool();
  if (!db) return null;

  const result = await db.query(
    "select id, email, name, password_hash, created_at from users where lower(email) = lower($1)",
    [email.trim()]
  );
  const row = result.rows[0];
  if (!row) return null;
  return {
    ...mapUser(row),
    passwordHash: row.password_hash as string,
  };
}

export async function findUserById(id: string): Promise<AuthUser | null> {
  const db = getPool();
  if (!db) return null;

  const result = await db.query(
    "select id, email, name, created_at from users where id = $1",
    [id]
  );
  const row = result.rows[0];
  if (!row) return null;
  return mapUser(row);
}

export async function createUser(input: {
  email: string;
  name: string;
  password: string;
}): Promise<AuthUser> {
  const db = getPool();
  if (!db) throw new Error("Database unavailable");

  const email = input.email.trim().toLowerCase();
  const name = input.name.trim();
  if (!email || !name || !input.password) {
    throw new Error("Name, email, and password are required");
  }
  if (input.password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }

  const existing = await findUserByEmail(email);
  if (existing) {
    throw new Error("An account with this email already exists");
  }

  const id = `user-${randomUUID()}`;
  const passwordHash = await bcrypt.hash(input.password, 10);

  const result = await db.query(
    `insert into users (id, email, name, password_hash)
     values ($1, $2, $3, $4)
     returning id, email, name, created_at`,
    [id, email, name, passwordHash]
  );

  // Seed empty per-user meta row
  await db.query(
    `insert into finance_meta (id, user_id, health_score, db_config)
     values ($1, $1, '{}'::jsonb, '{}'::jsonb)
     on conflict (id) do nothing`,
    [id]
  );

  return mapUser(result.rows[0]);
}

export async function verifyPassword(
  password: string,
  passwordHash: string
): Promise<boolean> {
  return bcrypt.compare(password, passwordHash);
}
