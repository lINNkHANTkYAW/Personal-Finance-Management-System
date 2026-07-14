import pg from "pg";
import type {
  FinanceData,
  Account,
  Transaction,
  Budget,
  SavingsGoal,
  Investment,
  UpcomingBill,
} from "../types";

const { Pool } = pg;

let pool: pg.Pool | null = null;
let poolInitFailed = false;

export function getDatabaseEnvConfig() {
  return {
    host: process.env.POSTGRES_HOST || "localhost",
    port: Number(process.env.POSTGRES_PORT || 5433),
    database: process.env.POSTGRES_DB || "personal_finance",
    user: process.env.POSTGRES_USER || "pfms",
    password: process.env.POSTGRES_PASSWORD || "pfms_secret",
  };
}

function buildPool(): pg.Pool | null {
  if (pool) return pool;
  if (poolInitFailed) return null;

  const config = getDatabaseEnvConfig();

  try {
    pool = new Pool({
      ...config,
      max: 10,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 5_000,
    });
    pool.on("error", (err) => {
      console.error("Unexpected PostgreSQL pool error:", err);
    });
    return pool;
  } catch (err) {
    console.error("Failed to initialize PostgreSQL pool:", err);
    poolInitFailed = true;
    return null;
  }
}

export function getPool(): pg.Pool | null {
  return buildPool();
}

export function isDatabaseConfigured(): boolean {
  const config = getDatabaseEnvConfig();
  return Boolean(config.host && config.database && config.user);
}

type Row = Record<string, unknown>;

const fromAccountRow = (r: Row): Account => ({
  id: r.id as string,
  name: r.name as string,
  type: r.type as Account["type"],
  balance: Number(r.balance),
  currency: (r.currency as string) ?? "USD",
  lastUpdated: (r.last_updated as Date | string)
    ? new Date(r.last_updated as string).toISOString()
    : new Date().toISOString(),
});

const fromTransactionRow = (r: Row): Transaction => ({
  id: r.id as string,
  date:
    r.date instanceof Date
      ? r.date.toISOString().split("T")[0]
      : String(r.date),
  merchant: r.merchant as string,
  category: r.category as string,
  paymentMethod: r.payment_method as string,
  amount: Number(r.amount),
  status: r.status as Transaction["status"],
  type: r.type as Transaction["type"],
});

const fromBudgetRow = (r: Row): Budget => ({
  id: r.id as string,
  category: r.category as string,
  limit: Number(r.monthly_limit),
  spent: Number(r.spent),
  period: (r.period as string) ?? "Monthly",
});

const fromGoalRow = (r: Row): SavingsGoal => ({
  id: r.id as string,
  name: r.name as string,
  target: Number(r.target),
  saved: Number(r.saved),
  targetDate:
    r.target_date instanceof Date
      ? r.target_date.toISOString().split("T")[0]
      : String(r.target_date),
});

const fromInvestmentRow = (r: Row): Investment => ({
  id: r.id as string,
  name: r.name as string,
  symbol: r.symbol as string,
  shares: Number(r.shares),
  currentPrice: Number(r.current_price),
  todayChangePercent: Number(r.today_change_percent),
  totalValue: Number(r.total_value),
  totalProfitLoss: Number(r.total_profit_loss),
  sparkline: ((r.sparkline as number[]) ?? []).map(Number),
});

const fromBillRow = (r: Row): UpcomingBill => ({
  id: r.id as string,
  name: r.name as string,
  amount: Number(r.amount),
  dueDate:
    r.due_date instanceof Date
      ? r.due_date.toISOString().split("T")[0]
      : String(r.due_date),
  category: r.category as string,
  status: r.status as UpcomingBill["status"],
  urgency: r.urgency as UpcomingBill["urgency"],
});

export interface LoadedRows {
  accounts: Account[];
  transactions: Transaction[];
  budgets: Budget[];
  savingsGoals: SavingsGoal[];
  investments: Investment[];
  bills: UpcomingBill[];
  healthScore: FinanceData["healthScore"] | null;
  dbConfig: FinanceData["dbConfig"] | null;
}

export async function loadAll(userId: string): Promise<LoadedRows | null> {
  const db = buildPool();
  if (!db) return null;

  try {
    const [accRes, txRes, budRes, goalRes, invRes, billRes, metaRes] =
      await Promise.all([
        db.query("select * from accounts where user_id = $1", [userId]),
        db.query("select * from transactions where user_id = $1", [userId]),
        db.query("select * from budgets where user_id = $1", [userId]),
        db.query("select * from savings_goals where user_id = $1", [userId]),
        db.query("select * from investments where user_id = $1", [userId]),
        db.query("select * from bills where user_id = $1", [userId]),
        db.query(
          "select * from finance_meta where user_id = $1 or id = $1 limit 1",
          [userId]
        ),
      ]);

    const meta = metaRes.rows[0] as Row | undefined;

    return {
      accounts: accRes.rows.map(fromAccountRow),
      transactions: txRes.rows.map(fromTransactionRow),
      budgets: budRes.rows.map(fromBudgetRow),
      savingsGoals: goalRes.rows.map(fromGoalRow),
      investments: invRes.rows.map(fromInvestmentRow),
      bills: billRes.rows.map(fromBillRow),
      healthScore: (meta?.health_score as FinanceData["healthScore"]) ?? null,
      dbConfig: (meta?.db_config as FinanceData["dbConfig"]) ?? null,
    };
  } catch (err) {
    console.error("PostgreSQL load failed:", err);
    return null;
  }
}

async function syncCollection(
  client: pg.PoolClient,
  table: string,
  userId: string,
  columns: string[],
  rows: unknown[][],
  idIndex = 0
): Promise<void> {
  const withUser = ["id", "user_id", ...columns.filter((c) => c !== "id")];

  if (rows.length > 0) {
    const placeholders = rows
      .map((_, rowIndex) => {
        const offset = rowIndex * withUser.length;
        const values = withUser
          .map((_, colIndex) => `$${offset + colIndex + 1}`)
          .join(", ");
        return `(${values})`;
      })
      .join(", ");

    const updates = withUser
      .filter((col) => col !== "id" && col !== "user_id")
      .map((col) => `${col} = excluded.${col}`)
      .join(", ");

    const flat = rows.flatMap((row) => {
      const id = row[idIndex];
      const rest = row.filter((_, i) => i !== idIndex);
      return [id, userId, ...rest];
    });

    await client.query(
      `insert into ${table} (${withUser.join(", ")})
       values ${placeholders}
       on conflict (id) do update set ${updates}
       where ${table}.user_id = excluded.user_id`,
      flat
    );

    const ids = rows.map((row) => row[idIndex]);
    await client.query(
      `delete from ${table} where user_id = $1 and id <> all($2::text[])`,
      [userId, ids]
    );
  } else {
    await client.query(`delete from ${table} where user_id = $1`, [userId]);
  }
}

export async function saveAll(
  userId: string,
  data: FinanceData
): Promise<boolean> {
  const db = buildPool();
  if (!db) return false;

  const client = await db.connect();
  try {
    await client.query("begin");

    await syncCollection(
      client,
      "accounts",
      userId,
      ["id", "name", "type", "balance", "currency", "last_updated"],
      data.accounts.map((a) => [
        a.id,
        a.name,
        a.type,
        a.balance,
        a.currency,
        a.lastUpdated,
      ])
    );

    await syncCollection(
      client,
      "transactions",
      userId,
      [
        "id",
        "date",
        "merchant",
        "category",
        "payment_method",
        "amount",
        "status",
        "type",
      ],
      data.transactions.map((t) => [
        t.id,
        t.date,
        t.merchant,
        t.category,
        t.paymentMethod,
        t.amount,
        t.status,
        t.type,
      ])
    );

    await syncCollection(
      client,
      "budgets",
      userId,
      ["id", "category", "monthly_limit", "spent", "period"],
      data.budgets.map((b) => [
        b.id,
        b.category,
        b.limit,
        b.spent,
        b.period,
      ])
    );

    await syncCollection(
      client,
      "savings_goals",
      userId,
      ["id", "name", "target", "saved", "target_date"],
      data.savingsGoals.map((g) => [
        g.id,
        g.name,
        g.target,
        g.saved,
        g.targetDate,
      ])
    );

    await syncCollection(
      client,
      "investments",
      userId,
      [
        "id",
        "name",
        "symbol",
        "shares",
        "current_price",
        "today_change_percent",
        "total_value",
        "total_profit_loss",
        "sparkline",
      ],
      data.investments.map((i) => [
        i.id,
        i.name,
        i.symbol,
        i.shares,
        i.currentPrice,
        i.todayChangePercent,
        i.totalValue,
        i.totalProfitLoss,
        i.sparkline ?? [],
      ])
    );

    await syncCollection(
      client,
      "bills",
      userId,
      ["id", "name", "amount", "due_date", "category", "status", "urgency"],
      data.bills.map((b) => [
        b.id,
        b.name,
        b.amount,
        b.dueDate,
        b.category,
        b.status,
        b.urgency,
      ])
    );

    await client.query(
      `insert into finance_meta (id, user_id, health_score, db_config)
       values ($1, $1, $2::jsonb, $3::jsonb)
       on conflict (id) do update
       set health_score = excluded.health_score,
           db_config = excluded.db_config,
           user_id = excluded.user_id`,
      [userId, JSON.stringify(data.healthScore), JSON.stringify(data.dbConfig)]
    );

    await client.query("commit");
    return true;
  } catch (err) {
    await client.query("rollback");
    console.error("PostgreSQL save failed:", err);
    return false;
  } finally {
    client.release();
  }
}

export async function testDatabaseConnection(): Promise<boolean> {
  const db = buildPool();
  if (!db) return false;

  try {
    await db.query("select 1");
    return true;
  } catch (err) {
    console.error("PostgreSQL connection test failed:", err);
    return false;
  }
}

export async function getDatabaseStatus(): Promise<{
  configured: boolean;
  connected: boolean;
  host: string;
  port: number;
  database: string;
}> {
  const config = getDatabaseEnvConfig();
  const configured = isDatabaseConfigured();
  const connected = configured ? await testDatabaseConnection() : false;
  return {
    configured,
    connected,
    host: config.host,
    port: config.port,
    database: config.database,
  };
}

let cachedStatus: {
  value: Awaited<ReturnType<typeof getDatabaseStatus>>;
  at: number;
} | null = null;
const STATUS_TTL_MS = 30_000;

export async function getCachedDatabaseStatus() {
  const now = Date.now();
  if (cachedStatus && now - cachedStatus.at < STATUS_TTL_MS) {
    return cachedStatus.value;
  }
  const value = await getDatabaseStatus();
  cachedStatus = { value, at: now };
  return value;
}

export function clearDatabaseStatusCache() {
  cachedStatus = null;
}
