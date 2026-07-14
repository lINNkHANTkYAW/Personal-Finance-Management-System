import { getPool } from "./postgres";

/** Apply schema upgrades for existing Docker volumes (init scripts only run once). */
export async function runMigrations(): Promise<void> {
  const db = getPool();
  if (!db) {
    console.warn("Skipping migrations — PostgreSQL pool unavailable.");
    return;
  }

  const client = await db.connect();
  try {
    await client.query("begin");

    await client.query(`
      create table if not exists users (
        id            text primary key,
        email         text not null unique,
        name          text not null,
        password_hash text not null,
        created_at    timestamptz not null default now()
      )
    `);

    await client.query(`
      create table if not exists "session" (
        "sid"    varchar not null collate "default",
        "sess"   json not null,
        "expire" timestamp(6) not null,
        primary key ("sid")
      )
    `);
    await client.query(`create index if not exists idx_session_expire on "session" ("expire")`);

    const tables = [
      "accounts",
      "transactions",
      "budgets",
      "savings_goals",
      "investments",
      "bills",
      "finance_meta",
    ];

    for (const table of tables) {
      await client.query(
        `alter table ${table} add column if not exists user_id text`
      );
    }

    // Drop orphan rows that cannot be owned by a real user.
    for (const table of tables) {
      await client.query(`delete from ${table} where user_id is null`);
    }

    // Ensure FK constraints exist (ignore if already present).
    for (const table of tables) {
      await client.query(`
        do $$ begin
          alter table ${table}
            add constraint ${table}_user_id_fkey
            foreign key (user_id) references users(id) on delete cascade;
        exception when duplicate_object then null;
        end $$;
      `);
    }

    await client.query(`
      do $$ begin
        alter table finance_meta
          add constraint finance_meta_user_id_unique unique (user_id);
      exception when duplicate_object then null;
      end $$;
    `);

    await client.query(`create index if not exists idx_accounts_user on accounts (user_id)`);
    await client.query(`create index if not exists idx_transactions_user on transactions (user_id)`);
    await client.query(`create index if not exists idx_budgets_user on budgets (user_id)`);
    await client.query(`create index if not exists idx_bills_user on bills (user_id)`);
    await client.query(`create index if not exists idx_savings_goals_user on savings_goals (user_id)`);
    await client.query(`create index if not exists idx_investments_user on investments (user_id)`);

    await client.query("commit");
    console.log("Database migrations applied.");
  } catch (err) {
    await client.query("rollback");
    console.error("Migration failed:", err);
    throw err;
  } finally {
    client.release();
  }
}
