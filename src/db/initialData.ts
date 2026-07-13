import { FinanceData } from "../types";

export const getInitialData = (): FinanceData => ({
  accounts: [
    {
      id: "acc-1",
      name: "Chase High Yield Checking",
      type: "checking",
      balance: 4250.75,
      currency: "USD",
      lastUpdated: "2026-07-12T14:30:00Z"
    },
    {
      id: "acc-2",
      name: "Marcus High Yield Savings",
      type: "savings",
      balance: 8200.00,
      currency: "USD",
      lastUpdated: "2026-07-12T14:30:00Z"
    },
    {
      id: "acc-3",
      name: "Robinhood Brokerage",
      type: "investment",
      balance: 15420.50,
      currency: "USD",
      lastUpdated: "2026-07-12T14:30:00Z"
    }
  ],
  transactions: [
    {
      id: "tx-1",
      date: "2026-07-12",
      merchant: "Starbucks",
      category: "Food",
      paymentMethod: "Visa Debit",
      amount: 6.75,
      status: "completed",
      type: "expense"
    },
    {
      id: "tx-2",
      date: "2026-07-11",
      merchant: "Amazon",
      category: "Shopping",
      paymentMethod: "Visa Credit",
      amount: 142.50,
      status: "completed",
      type: "expense"
    },
    {
      id: "tx-3",
      date: "2026-07-10",
      merchant: "Netflix",
      category: "Entertainment",
      paymentMethod: "Visa Credit",
      amount: 19.99,
      status: "completed",
      type: "expense"
    },
    {
      id: "tx-4",
      date: "2026-07-09",
      merchant: "Uber",
      category: "Transportation",
      paymentMethod: "Apple Pay",
      amount: 24.50,
      status: "completed",
      type: "expense"
    },
    {
      id: "tx-5",
      date: "2026-07-08",
      merchant: "Apple",
      category: "Shopping",
      paymentMethod: "Apple Pay",
      amount: 149.00,
      status: "completed",
      type: "expense"
    },
    {
      id: "tx-6",
      date: "2026-07-07",
      merchant: "Shell",
      category: "Utilities",
      paymentMethod: "Visa Debit",
      amount: 45.20,
      status: "completed",
      type: "expense"
    },
    {
      id: "tx-7",
      date: "2026-07-06",
      merchant: "Costco",
      category: "Food",
      paymentMethod: "Visa Debit",
      amount: 210.50,
      status: "completed",
      type: "expense"
    },
    {
      id: "tx-8",
      date: "2026-07-05",
      merchant: "Spotify",
      category: "Entertainment",
      paymentMethod: "Visa Credit",
      amount: 10.99,
      status: "completed",
      type: "expense"
    },
    {
      id: "tx-9",
      date: "2026-07-01",
      merchant: "Acme Corp (Salary)",
      category: "Salary",
      paymentMethod: "Direct Deposit",
      amount: 5420.00,
      status: "completed",
      type: "income"
    }
  ],
  budgets: [
    {
      id: "b-1",
      category: "Food",
      limit: 600,
      spent: 450,
      period: "Monthly"
    },
    {
      id: "b-2",
      category: "Shopping",
      limit: 500,
      spent: 320,
      period: "Monthly"
    },
    {
      id: "b-3",
      category: "Transportation",
      limit: 250,
      spent: 110,
      period: "Monthly"
    }
  ],
  savingsGoals: [
    {
      id: "sg-1",
      name: "Emergency Fund",
      target: 10000,
      saved: 7450,
      targetDate: "2026-12-31"
    },
    {
      id: "sg-2",
      name: "Vacation",
      target: 5000,
      saved: 2900,
      targetDate: "2026-09-15"
    },
    {
      id: "sg-3",
      name: "New Laptop",
      target: 2500,
      saved: 1100,
      targetDate: "2026-10-01"
    }
  ],
  investments: [
    {
      id: "inv-1",
      name: "Apple Inc.",
      symbol: "AAPL",
      shares: 45,
      currentPrice: 182.50,
      todayChangePercent: 1.25,
      totalValue: 8212.50,
      totalProfitLoss: 1450.20,
      sparkline: [175, 176, 174, 178, 179, 181, 182.50]
    },
    {
      id: "inv-2",
      name: "Bitcoin",
      symbol: "BTC",
      shares: 0.12,
      currentPrice: 65200.00,
      todayChangePercent: -2.40,
      totalValue: 7824.00,
      totalProfitLoss: 2150.80,
      sparkline: [67000, 66500, 66800, 66000, 65800, 64900, 65200.00]
    },
    {
      id: "inv-3",
      name: "S&P 500 ETF",
      symbol: "SPY",
      shares: 15,
      currentPrice: 512.30,
      todayChangePercent: 0.45,
      totalValue: 7684.50,
      totalProfitLoss: 890.30,
      sparkline: [505, 508, 506, 510, 511, 511.5, 512.30]
    },
    {
      id: "inv-4",
      name: "Gold ETF",
      symbol: "GLD",
      shares: 20,
      currentPrice: 218.40,
      todayChangePercent: -0.15,
      totalValue: 4368.00,
      totalProfitLoss: 320.10,
      sparkline: [219, 218.5, 218, 218.2, 218.9, 218.6, 218.40]
    }
  ],
  bills: [
    {
      id: "bill-1",
      name: "Internet (Comcast)",
      amount: 85.00,
      dueDate: "2026-07-15",
      category: "Utilities",
      status: "unpaid",
      urgency: "medium"
    },
    {
      id: "bill-2",
      name: "Electricity (PG&E)",
      amount: 145.20,
      dueDate: "2026-07-14",
      category: "Utilities",
      status: "unpaid",
      urgency: "high"
    },
    {
      id: "bill-3",
      name: "Rent (Apartment)",
      amount: 1850.00,
      dueDate: "2026-08-01",
      category: "Housing",
      status: "unpaid",
      urgency: "low"
    },
    {
      id: "bill-4",
      name: "Netflix",
      amount: 19.99,
      dueDate: "2026-07-28",
      category: "Entertainment",
      status: "unpaid",
      urgency: "low"
    },
    {
      id: "bill-5",
      name: "Spotify Family",
      amount: 16.99,
      dueDate: "2026-07-29",
      category: "Entertainment",
      status: "unpaid",
      urgency: "low"
    },
    {
      id: "bill-6",
      name: "Car Insurance (Geico)",
      amount: 125.00,
      dueDate: "2026-07-18",
      category: "Transportation",
      status: "unpaid",
      urgency: "medium"
    }
  ],
  healthScore: {
    score: 89,
    rating: "Excellent",
    label: "Your financial health is in the top tier."
  },
  supabaseConfig: {
    url: "",
    anonKey: "",
    isConnected: false
  }
});
