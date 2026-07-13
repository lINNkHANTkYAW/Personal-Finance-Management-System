export enum View {
  Dashboard = "Dashboard",
  Accounts = "Accounts",
  Transactions = "Transactions",
  Budgets = "Budgets",
  SavingsGoals = "Savings Goals",
  Investments = "Investments",
  Bills = "Bills",
  Analytics = "Analytics",
  AIInsights = "AI Insights",
  Reports = "Reports",
  Settings = "Settings",
}

export type Language = "en" | "ja";

export interface Account {
  id: string;
  name: string;
  type: "checking" | "savings" | "credit" | "investment";
  balance: number;
  currency: string;
  lastUpdated: string;
}

export interface Transaction {
  id: string;
  date: string;
  merchant: string;
  category: string;
  paymentMethod: string;
  amount: number;
  status: "completed" | "pending" | "failed";
  type: "expense" | "income";
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
  period: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  target: number;
  saved: number;
  targetDate: string;
}

export interface Investment {
  id: string;
  name: string;
  symbol: string;
  shares: number;
  currentPrice: number;
  todayChangePercent: number;
  totalValue: number;
  totalProfitLoss: number;
  sparkline: number[];
}

export interface UpcomingBill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  category: string;
  status: "paid" | "unpaid" | "overdue";
  urgency: "low" | "medium" | "high";
}

export interface AIRecommendation {
  id: string;
  text: string;
  type: "warning" | "savings" | "milestone" | "info";
}

export interface FinancialHealth {
  score: number;
  rating: string;
  label: string;
}

export interface FinanceData {
  accounts: Account[];
  transactions: Transaction[];
  budgets: Budget[];
  savingsGoals: SavingsGoal[];
  investments: Investment[];
  bills: UpcomingBill[];
  healthScore: FinancialHealth;
  supabaseConfig: {
    url: string;
    anonKey: string;
    isConnected: boolean;
  };
}

export interface ReceiptScanResult {
  merchant: string;
  amount: number;
  tax: number;
  date: string;
  category: string;
  rawText?: string;
}
