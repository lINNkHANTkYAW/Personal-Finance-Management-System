import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type {
  FinanceData,
  Account,
  Transaction,
  Budget,
  SavingsGoal,
  Investment,
  UpcomingBill,
} from "../types";

let client: SupabaseClient | null = null;
let clientInitFailed = false;

function getSupabaseEnvConfig() {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPERBASE_URL ||
    process.env.VITE_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    null;

  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPERBASE_PUBLISHABLE_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    null;

  return { url, key };
}

function buildClient(): SupabaseClient | null {
  if (client) return client;
  if (clientInitFailed) return null;

  const { url, key } = getSupabaseEnvConfig();

  if (!url || !key || url.trim() === "" || key.trim() === "") {
    clientInitFailed = true;
    return null;
  }

  try {
    client = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    return client;
  } catch (err) {
    console.error("Failed to initialize Supabase client:", err);
    clientInitFailed = true;
    return null;
  }
}

export function getSupabaseClient(): SupabaseClient | null {
  return buildClient();
}

export function isSupabaseConfigured(): boolean {
  return buildClient() !== null;
}

// ---------------------------------------------------------------------------
// Row mappers (TS camelCase <-> Postgres snake_case)
// ---------------------------------------------------------------------------

type Row = Record<string, unknown>;

function isMissingSchemaError(error: { message?: string } | null | undefined): boolean {
  if (!error) return false;
  const message = (error.message || "").toLowerCase();
  return (
    message.includes("does not exist") ||
    message.includes("relation") ||
    message.includes("column") ||
    message.includes("schema cache") ||
    message.includes("not found")
  );
}

const toAccountRow = (a: Account): Row => ({
  id: a.id,
  name: a.name,
  type: a.type,
  balance: a.balance,
  currency: a.currency,
  last_updated: a.lastUpdated,
});
const fromAccountRow = (r: Row): Account => ({
  id: r.id as string,
  name: r.name as string,
  type: r.type as Account["type"],
  balance: Number(r.balance),
  currency: (r.currency as string) ?? "USD",
  lastUpdated: (r.last_updated as string) ?? new Date().toISOString(),
});

const toTransactionRow = (t: Transaction): Row => ({
  id: t.id,
  date: t.date,
  merchant: t.merchant,
  category: t.category,
  payment_method: t.paymentMethod,
  amount: t.amount,
  status: t.status,
  type: t.type,
});
const fromTransactionRow = (r: Row): Transaction => ({
  id: r.id as string,
  date: r.date as string,
  merchant: r.merchant as string,
  category: r.category as string,
  paymentMethod: r.payment_method as string,
  amount: Number(r.amount),
  status: r.status as Transaction["status"],
  type: r.type as Transaction["type"],
});

const toBudgetRow = (b: Budget): Row => ({
  id: b.id,
  category: b.category,
  monthly_limit: b.limit,
  spent: b.spent,
  period: b.period,
});
const fromBudgetRow = (r: Row): Budget => ({
  id: r.id as string,
  category: r.category as string,
  limit: Number(r.monthly_limit),
  spent: Number(r.spent),
  period: (r.period as string) ?? "Monthly",
});

const toGoalRow = (g: SavingsGoal): Row => ({
  id: g.id,
  name: g.name,
  target: g.target,
  saved: g.saved,
  target_date: g.targetDate,
});
const fromGoalRow = (r: Row): SavingsGoal => ({
  id: r.id as string,
  name: r.name as string,
  target: Number(r.target),
  saved: Number(r.saved),
  targetDate: r.target_date as string,
});

const toInvestmentRow = (i: Investment): Row => ({
  id: i.id,
  name: i.name,
  symbol: i.symbol,
  shares: i.shares,
  current_price: i.currentPrice,
  today_change_percent: i.todayChangePercent,
  total_value: i.totalValue,
  total_profit_loss: i.totalProfitLoss,
  sparkline: i.sparkline ?? [],
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
  sparkline: (r.sparkline as number[]) ?? [],
});

const toBillRow = (b: UpcomingBill): Row => ({
  id: b.id,
  name: b.name,
  amount: b.amount,
  due_date: b.dueDate,
  category: b.category,
  status: b.status,
  urgency: b.urgency,
});
const fromBillRow = (r: Row): UpcomingBill => ({
  id: r.id as string,
  name: r.name as string,
  amount: Number(r.amount),
  dueDate: r.due_date as string,
  category: r.category as string,
  status: r.status as UpcomingBill["status"],
  urgency: r.urgency as UpcomingBill["urgency"],
});

// ---------------------------------------------------------------------------
// Load: read every table and return the assembled rows (or null on error)
// ---------------------------------------------------------------------------

export interface LoadedRows {
  accounts: Account[];
  transactions: Transaction[];
  budgets: Budget[];
  savingsGoals: SavingsGoal[];
  investments: Investment[];
  bills: UpcomingBill[];
  healthScore: FinanceData["healthScore"] | null;
  supabaseConfig: FinanceData["supabaseConfig"] | null;
}

export async function loadAll(): Promise<LoadedRows | null> {
  const sb = buildClient();
  if (!sb) return null;

  try {
    const [accRes, txRes, budRes, goalRes, invRes, billRes] = await Promise.all([
      sb.from("accounts").select("*"),
      sb.from("transactions").select("*"),
      sb.from("budgets").select("*"),
      sb.from("savings_goals").select("*"),
      sb.from("investments").select("*"),
      sb.from("bills").select("*"),
    ]);

    const firstError =
      accRes.error ||
      txRes.error ||
      budRes.error ||
      goalRes.error ||
      invRes.error ||
      billRes.error;
    if (firstError) {
      console.error("Supabase load error:", firstError.message);
      return null;
    }

    let metaRes = { data: null, error: null as { message?: string } | null };
    try {
      metaRes = await sb.from("finance_meta").select("*").eq("id", "main").maybeSingle();
    } catch (err) {
      console.warn("Supabase metadata table unavailable, continuing without it:", err);
    }

    if (metaRes.error && !isMissingSchemaError(metaRes.error)) {
      console.warn("Supabase metadata load warning:", metaRes.error.message);
    }

    return {
      accounts: (accRes.data ?? []).map(fromAccountRow),
      transactions: (txRes.data ?? []).map(fromTransactionRow),
      budgets: (budRes.data ?? []).map(fromBudgetRow),
      savingsGoals: (goalRes.data ?? []).map(fromGoalRow),
      investments: (invRes.data ?? []).map(fromInvestmentRow),
      bills: (billRes.data ?? []).map(fromBillRow),
      healthScore: (metaRes.data?.health_score as FinanceData["healthScore"]) ?? null,
      supabaseConfig: (metaRes.data?.supabase_config as FinanceData["supabaseConfig"]) ?? null,
    };
  } catch (err) {
    console.error("Supabase load failed:", err);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Save: upsert every collection + delete rows no longer present
// ---------------------------------------------------------------------------

async function syncCollection(
  sb: SupabaseClient,
  table: string,
  rows: Row[]
): Promise<void> {
  if (rows.length > 0) {
    const dedupedRows = rows.filter((row) => row.id);
    const { error: upsertErr } = await sb.from(table).upsert(dedupedRows, {
      onConflict: "id",
    });
    if (upsertErr) throw upsertErr;

    const ids = dedupedRows.map((r) => r.id);
    if (ids.length > 0) {
      const { error: delErr } = await sb
        .from(table)
        .delete()
        .not("id", "in", `(${ids.map((id) => `'${id}'`).join(",")})`);
      if (delErr) throw delErr;
    }
  } else {
    const { error: delErr } = await sb.from(table).delete().not("id", "is", null);
    if (delErr) throw delErr;
  }
}

export async function saveAll(data: FinanceData): Promise<boolean> {
  const sb = buildClient();
  if (!sb) return false;

  try {
    await Promise.all([
      syncCollection(sb, "accounts", data.accounts.map(toAccountRow)),
      syncCollection(sb, "transactions", data.transactions.map(toTransactionRow)),
      syncCollection(sb, "budgets", data.budgets.map(toBudgetRow)),
      syncCollection(sb, "savings_goals", data.savingsGoals.map(toGoalRow)),
      syncCollection(sb, "investments", data.investments.map(toInvestmentRow)),
      syncCollection(sb, "bills", data.bills.map(toBillRow)),
    ]);

    try {
      const { error: metaErr } = await sb.from("finance_meta").upsert(
        {
          id: "main",
          health_score: data.healthScore,
          supabase_config: data.supabaseConfig,
        },
        { onConflict: "id" }
      );
      if (metaErr && !isMissingSchemaError(metaErr)) throw metaErr;
    } catch (err) {
      if (!isMissingSchemaError(err as { message?: string })) {
        throw err;
      }
    }

    return true;
  } catch (err) {
    console.error("Supabase save failed:", err);
    return false;
  }
}

// ---------------------------------------------------------------------------
// Connection test + cached status
// ---------------------------------------------------------------------------

export async function testSupabaseConnection(): Promise<boolean> {
  const sb = buildClient();
  if (!sb) return false;

  try {
    const { error } = await sb.from("accounts").select("id").limit(1);
    if (error) {
      console.error("Supabase connection test failed:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Supabase connection test failed:", err);
    return false;
  }
}

export async function getSupabaseStatus(): Promise<{
  configured: boolean;
  connected: boolean;
  url: string | null;
}> {
  const configured = isSupabaseConfigured();
  const { url } = getSupabaseEnvConfig();
  const connected = configured ? await testSupabaseConnection() : false;
  return { configured, connected, url };
}

// Cache the connection status for a short window so we don't hammer Supabase
// (and spam error logs) on every GET /api/finance request.
let cachedStatus: { value: Awaited<ReturnType<typeof getSupabaseStatus>>; at: number } | null = null;
const STATUS_TTL_MS = 30_000;

export async function getCachedSupabaseStatus() {
  const now = Date.now();
  if (cachedStatus && now - cachedStatus.at < STATUS_TTL_MS) {
    return cachedStatus.value;
  }
  const value = await getSupabaseStatus();
  cachedStatus = { value, at: now };
  return value;
}
