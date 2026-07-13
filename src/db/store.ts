import fs from "fs";
import path from "path";
import { getInitialData } from "./initialData";
import { FinanceData, Transaction, Budget, SavingsGoal, UpcomingBill, Account } from "../types";

const DATA_FILE = path.join(process.cwd(), "src", "db", "data.json");

export function loadFinanceData(): FinanceData {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, "utf-8");
      return JSON.parse(content);
    }
  } catch (error) {
    console.error("Error loading data from file, using initial data:", error);
  }

  const initial = getInitialData();
  saveFinanceData(initial);
  return initial;
}

export function saveFinanceData(data: FinanceData): void {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Error saving data to file:", error);
  }
}

export function updateFinancialKPIs(data: FinanceData): FinanceData {
  // Recalculate transaction totals for July 2026
  const txs = data.transactions;
  const currentMonthYear = "2026-07";

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

  // Calculate savings rate
  let savingsRate = 0;
  if (monthlyIncome > 0) {
    savingsRate = Math.round(((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100);
    if (savingsRate < 0) savingsRate = 0;
  } else {
    savingsRate = 0;
  }

  // Calculate budgets spent
  data.budgets.forEach((budget) => {
    const categorySpent = txs
      .filter((tx) => tx.category.toLowerCase() === budget.category.toLowerCase() && tx.type === "expense" && tx.date.startsWith(currentMonthYear))
      .reduce((sum, tx) => sum + tx.amount, 0);
    budget.spent = Math.round(categorySpent * 100) / 100;
  });

  // Calculate Health Score based on factors:
  // - Savings Rate (higher is better)
  // - Budget overruns
  // - Savings goals progress
  let budgetOverruns = 0;
  data.budgets.forEach((b) => {
    if (b.spent > b.limit) budgetOverruns++;
  });

  let baseScore = 75;
  baseScore += Math.floor(savingsRate / 4); // max +25
  baseScore -= budgetOverruns * 8; // penalty
  
  const savedRatio = data.savingsGoals.reduce((sum, g) => sum + (g.saved / g.target), 0) / (data.savingsGoals.length || 1);
  baseScore += Math.floor(savedRatio * 10); // max +10

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
    label
  };

  return data;
}
