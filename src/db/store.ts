import { FinanceData } from "../types";
import {
  isDatabaseConfigured,
  loadAll,
  saveAll,
  type LoadedRows,
} from "./postgres";

export function isDatabaseActive(): boolean {
  return isDatabaseConfigured();
}

function createEmptyFinanceData(): FinanceData {
  return {
    accounts: [],
    transactions: [],
    budgets: [],
    savingsGoals: [],
    investments: [],
    bills: [],
    healthScore: {
      score: 0,
      rating: "Fair",
      label: "Start by adding your first account or transaction.",
    },
    dbConfig: {
      host: process.env.POSTGRES_HOST || "localhost",
      port: Number(process.env.POSTGRES_PORT || 5433),
      database: process.env.POSTGRES_DB || "personal_finance",
      isConnected: false,
    },
  };
}

function assemble(rows: LoadedRows): FinanceData {
  return {
    accounts: rows.accounts,
    transactions: rows.transactions,
    budgets: rows.budgets,
    savingsGoals: rows.savingsGoals,
    investments: rows.investments,
    bills: rows.bills,
    healthScore:
      rows.healthScore ?? { score: 0, rating: "Fair", label: "" },
    dbConfig:
      rows.dbConfig ?? createEmptyFinanceData().dbConfig,
  };
}

export async function loadFinanceData(userId: string): Promise<FinanceData> {
  if (isDatabaseConfigured()) {
    const rows = await loadAll(userId);
    if (rows) {
      return assemble(rows);
    }
  }

  return createEmptyFinanceData();
}

export async function saveFinanceData(
  userId: string,
  data: FinanceData
): Promise<void> {
  if (!isDatabaseConfigured()) {
    console.error("PostgreSQL is not configured; cannot persist finance data.");
    return;
  }

  const ok = await saveAll(userId, data);
  if (!ok) {
    console.error("Failed to persist finance data to PostgreSQL.");
  }
}

export function updateFinancialKPIs(data: FinanceData): FinanceData {
  const txs = data.transactions;
  const now = new Date();
  const currentMonthYear = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  let monthlyIncome = 0;
  let monthlyExpenses = 0;

  txs.forEach((tx) => {
    if (tx.date.startsWith(currentMonthYear)) {
      if (tx.type === "income" && tx.status === "completed") {
        monthlyIncome += tx.amount;
      } else if (tx.type === "expense" && tx.status === "completed") {
        monthlyExpenses += tx.amount;
      }
    }
  });

  let savingsRate = 0;
  if (monthlyIncome > 0) {
    savingsRate = Math.round(
      ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100
    );
    if (savingsRate < 0) savingsRate = 0;
  }

  data.budgets.forEach((budget) => {
    const categorySpent = txs
      .filter(
        (tx) =>
          tx.category.toLowerCase() === budget.category.toLowerCase() &&
          tx.type === "expense" &&
          tx.date.startsWith(currentMonthYear)
      )
      .reduce((sum, tx) => sum + tx.amount, 0);
    budget.spent = Math.round(categorySpent * 100) / 100;
  });

  let budgetOverruns = 0;
  data.budgets.forEach((b) => {
    if (b.spent > b.limit) budgetOverruns++;
  });

  let baseScore = data.accounts.length || data.transactions.length ? 75 : 0;
  if (baseScore === 0) {
    data.healthScore = {
      score: 0,
      rating: "Fair",
      label: "Start by adding your first account or transaction.",
    };
    return data;
  }

  baseScore += Math.floor(savingsRate / 4);
  baseScore -= budgetOverruns * 8;

  const savedRatio =
    data.savingsGoals.reduce((sum, g) => sum + g.saved / g.target, 0) /
    (data.savingsGoals.length || 1);
  baseScore += Math.floor(savedRatio * 10);

  const finalScore = Math.min(100, Math.max(30, baseScore));
  let rating = "Fair";
  let label = "Your financial health has room for improvement.";
  if (finalScore >= 90) {
    rating = "Excellent";
    label = "Your financial health is in the top tier.";
  } else if (finalScore >= 80) {
    rating = "Very Good";
    label = "Your financial health is strong and stable.";
  } else if (finalScore >= 65) {
    rating = "Good";
    label = "You have a solid foundation, minor adjustments recommended.";
  }

  data.healthScore = {
    score: finalScore,
    rating,
    label,
  };

  return data;
}
