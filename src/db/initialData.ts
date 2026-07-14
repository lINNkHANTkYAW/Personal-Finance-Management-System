import { FinanceData } from "../types";

/** Empty starting state — no demo / mock finance data. */
export const getInitialData = (): FinanceData => ({
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
});
