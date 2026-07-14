import React, { useState, useEffect } from "react";
import { FinanceData, Transaction, Language, View } from "../types";
import { translations, formatCurrency, translateCategory } from "../lib/translations";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend 
} from "recharts";
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Sparkles, 
  Activity, 
  PlusCircle, 
  FileSearch, 
  Plus, 
  ArrowUpDown, 
  Calendar, 
  CreditCard, 
  AlertTriangle, 
  CheckCircle, 
  HelpCircle,
  Clock,
  PieChart as PieIcon,
  PiggyBank,
  ChevronRight,
  Camera
} from "lucide-react";
import ReceiptScanner from "./ReceiptScanner";

interface DashboardViewProps {
  data: FinanceData;
  language: Language;
  currency: string;
  onUpdateData: (data: FinanceData) => void;
  setCurrentView: (view: View) => void;
}

export default function DashboardView({
  data,
  language,
  currency,
  onUpdateData,
  setCurrentView
}: DashboardViewProps) {
  const t = translations[language];
  const [showScanner, setShowScanner] = useState(false);
  
  // Local quick action modals or forms
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showAddIncome, setShowAddIncome] = useState(false);
  const [expenseMerchant, setExpenseMerchant] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseCategory, setExpenseCategory] = useState("Food");
  const [incomeMerchant, setIncomeMerchant] = useState("");
  const [incomeAmount, setIncomeAmount] = useState("");

  const COLORS = ["#10B981", "#3B82F6", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#14B8A6", "#64748B"];

  const now = new Date();
  const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const monthKeys = Array.from({ length: 12 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
    return {
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
      label: d.toLocaleString(language === "ja" ? "ja-JP" : "en-US", {
        month: "short",
        year: "2-digit",
      }),
      shortLabel: d.toLocaleString(language === "ja" ? "ja-JP" : "en-US", {
        month: "short",
      }),
    };
  });

  const monthTotals = monthKeys.map(({ key, label, shortLabel }) => {
    const monthTxs = data.transactions.filter(
      (tx) => tx.date.startsWith(key) && tx.status === "completed"
    );
    const income = monthTxs
      .filter((tx) => tx.type === "income")
      .reduce((sum, tx) => sum + tx.amount, 0);
    const expenses = monthTxs
      .filter((tx) => tx.type === "expense")
      .reduce((sum, tx) => sum + tx.amount, 0);
    return { key, label, shortLabel, income, expenses, net: income - expenses };
  });

  const totalBalanceVal = data.accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const currentMonth = monthTotals[monthTotals.length - 1] ?? {
    income: 0,
    expenses: 0,
  };
  const monthlyIncomeVal = currentMonth.income;
  const monthlyExpensesVal = currentMonth.expenses;
  const savingsRateVal =
    monthlyIncomeVal > 0
      ? Math.max(
          0,
          Math.round(((monthlyIncomeVal - monthlyExpensesVal) / monthlyIncomeVal) * 100)
        )
      : 0;

  // Reconstruct month-end balances from current totals walked backward by net cashflow.
  let runningBalance = totalBalanceVal;
  const lineChartData = [...monthTotals]
    .reverse()
    .map((month, index) => {
      const point = { month: month.label, Balance: Math.round(runningBalance * 100) / 100 };
      if (index < monthTotals.length - 1) {
        runningBalance -= month.net;
      }
      return point;
    })
    .reverse();

  const barChartData = monthTotals.slice(-6).map((month) => ({
    month: month.shortLabel,
    Income: Math.round(month.income * 100) / 100,
    Expenses: Math.round(month.expenses * 100) / 100,
  }));

  const categoryTotals = new Map<string, number>();
  data.transactions
    .filter(
      (tx) =>
        tx.type === "expense" &&
        tx.status === "completed" &&
        tx.date.startsWith(currentMonthKey)
    )
    .forEach((tx) => {
      categoryTotals.set(
        tx.category,
        (categoryTotals.get(tx.category) || 0) + tx.amount
      );
    });

  const donutData = Array.from(categoryTotals.entries())
    .map(([name, value]) => ({
      name: translateCategory(name, language),
      value: Math.round(value * 100) / 100,
    }))
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value);

  const healthScore = data.healthScore?.score ?? 0;
  const healthLabelText =
    data.healthScore?.label ||
    (language === "ja"
      ? "口座や取引を追加すると健全性が更新されます。"
      : "Add accounts and transactions to build your financial health score.");

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseMerchant || !expenseAmount) return;

    try {
      const response = await fetch("/api/finance/transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          merchant: expenseMerchant,
          amount: parseFloat(expenseAmount),
          category: expenseCategory,
          type: "expense",
          date: new Date().toISOString().split("T")[0],
          paymentMethod: "Visa Debit"
        })
      });

      if (response.ok) {
        const fresh = await response.json();
        onUpdateData(fresh);
        setExpenseMerchant("");
        setExpenseAmount("");
        setShowAddExpense(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddIncome = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!incomeMerchant || !incomeAmount) return;

    try {
      const response = await fetch("/api/finance/transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          merchant: incomeMerchant,
          amount: parseFloat(incomeAmount),
          category: "Salary",
          type: "income",
          date: new Date().toISOString().split("T")[0],
          paymentMethod: "Direct Deposit"
        })
      });

      if (response.ok) {
        const fresh = await response.json();
        onUpdateData(fresh);
        setIncomeMerchant("");
        setIncomeAmount("");
        setShowAddIncome(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 select-none animate-fade-in">
      
      {/* 1. HERO SECTION KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Current Balance */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">
              {t.currentBalance}
            </span>
            <h3 className="font-sans font-extrabold text-2xl text-slate-800 dark:text-slate-100 mt-1">
              {formatCurrency(totalBalanceVal, currency, language)}
            </h3>
            <p className="text-[10px] text-slate-400 font-semibold mt-1">
              {data.accounts.length === 0
                ? (language === "ja" ? "口座が未登録です" : "No accounts yet")
                : `${data.accounts.length} ${language === "ja" ? "口座" : "accounts"}`}
            </p>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20 rounded-xl">
            <Wallet size={20} />
          </div>
        </div>

        {/* Card 2: Monthly Income */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">
              {t.monthlyIncome}
            </span>
            <h3 className="font-sans font-extrabold text-2xl text-slate-800 dark:text-slate-100 mt-1">
              {formatCurrency(monthlyIncomeVal, currency, language)}
            </h3>
            <p className="text-[10px] text-slate-400 font-semibold mt-1">
              {language === "ja" ? "今月の収入" : "This month"}
            </p>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20 rounded-xl">
            <ArrowDownLeft size={20} />
          </div>
        </div>

        {/* Card 3: Monthly Expenses */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">
              {t.monthlyExpenses}
            </span>
            <h3 className="font-sans font-extrabold text-2xl text-slate-800 dark:text-slate-100 mt-1">
              {formatCurrency(monthlyExpensesVal, currency, language)}
            </h3>
            <p className="text-[10px] text-slate-400 font-semibold mt-1">
              {language === "ja" ? "今月の支出" : "This month"}
            </p>
          </div>
          <div className="p-3 bg-red-500/10 text-red-500 dark:bg-red-500/20 rounded-xl">
            <ArrowUpRight size={20} />
          </div>
        </div>

        {/* Card 4: Savings Rate */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">
              {t.savingsRate}
            </span>
            <h3 className="font-sans font-extrabold text-2xl text-slate-800 dark:text-slate-100 mt-1">
              {savingsRateVal}%
            </h3>
            <p className="text-[10px] text-slate-400 font-semibold mt-1">
              {monthlyIncomeVal > 0
                ? (language === "ja" ? "収入に対する貯蓄割合" : "Of this month's income")
                : (language === "ja" ? "収入データなし" : "No income recorded")}
            </p>
          </div>
          <div className="p-3 bg-blue-500/10 text-blue-500 dark:bg-blue-500/20 rounded-xl">
            <Activity size={20} />
          </div>
        </div>

      </div>

      {/* Trigger scanner widget if toggled */}
      {showScanner && (
        <div className="my-6">
          <ReceiptScanner
            language={language}
            onClose={() => setShowScanner(false)}
            onAddTransaction={(tx) => {
              // Add direct logic
              const updatedData = {
                ...data,
                transactions: [
                  {
                    id: `tx-${Date.now()}`,
                    date: tx.date,
                    merchant: tx.merchant,
                    category: tx.category,
                    paymentMethod: tx.paymentMethod,
                    amount: tx.amount,
                    status: "completed" as const,
                    type: "expense" as const
                  },
                  ...data.transactions
                ]
              };
              onUpdateData(updatedData);
            }}
          />
        </div>
      )}

      {/* QUICK FORM POPUPS */}
      {showAddExpense && (
        <form onSubmit={handleAddExpense} className="p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl shadow-md max-w-sm">
          <h4 className="text-xs font-bold mb-3 uppercase text-slate-700 dark:text-slate-300">Quick Expense Entry</h4>
          <div className="space-y-2.5">
            <input
              type="text" required placeholder="Merchant" value={expenseMerchant} onChange={(e)=>setExpenseMerchant(e.target.value)}
              className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800"
            />
            <input
              type="number" required placeholder="Amount ($)" value={expenseAmount} onChange={(e)=>setExpenseAmount(e.target.value)}
              className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800"
            />
            <select
              value={expenseCategory} onChange={(e)=>setExpenseCategory(e.target.value)}
              className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800"
            >
              <option value="Food">{t.food}</option>
              <option value="Shopping">{t.shopping}</option>
              <option value="Transportation">{t.transport}</option>
            </select>
            <div className="flex justify-end gap-2 text-xs pt-2">
              <button type="button" onClick={()=>setShowAddExpense(false)} className="px-3 py-1.5 rounded-lg border">Cancel</button>
              <button type="submit" className="px-3 py-1.5 bg-emerald-500 text-white rounded-lg font-semibold">Save</button>
            </div>
          </div>
        </form>
      )}

      {showAddIncome && (
        <form onSubmit={handleAddIncome} className="p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl shadow-md max-w-sm">
          <h4 className="text-xs font-bold mb-3 uppercase text-slate-700 dark:text-slate-300">Quick Income Entry</h4>
          <div className="space-y-2.5">
            <input
              type="text" required placeholder="Income Source" value={incomeMerchant} onChange={(e)=>setIncomeMerchant(e.target.value)}
              className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800"
            />
            <input
              type="number" required placeholder="Amount ($)" value={incomeAmount} onChange={(e)=>setIncomeAmount(e.target.value)}
              className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800"
            />
            <div className="flex justify-end gap-2 text-xs pt-2">
              <button type="button" onClick={()=>setShowAddIncome(false)} className="px-3 py-1.5 rounded-lg border">Cancel</button>
              <button type="submit" className="px-3 py-1.5 bg-emerald-500 text-white rounded-lg font-semibold">Save</button>
            </div>
          </div>
        </form>
      )}

      {/* 2. CORE INTERACTIVE QUICK ACTIONS ROW */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
          {t.quickActions}
        </span>
        
        <div className="flex flex-wrap gap-2.5">
          <button 
            onClick={() => setShowAddExpense(true)}
            className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-colors shadow-sm"
          >
            <Plus size={14} /> {t.addExpense}
          </button>
          <button 
            onClick={() => setShowAddIncome(true)}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-semibold px-3.5 py-2 rounded-xl border border-slate-200/50 dark:border-slate-700/50 transition-colors"
          >
            <Plus size={14} /> {t.addIncome}
          </button>
          <button 
            onClick={() => setCurrentView(View.SavingsGoals)}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-semibold px-3.5 py-2 rounded-xl border border-slate-200/50 dark:border-slate-700/50 transition-colors"
          >
            {t.transferMoney}
          </button>
          <button 
            onClick={() => setCurrentView(View.Budgets)}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-semibold px-3.5 py-2 rounded-xl border border-slate-200/50 dark:border-slate-700/50 transition-colors"
          >
            {t.createBudget}
          </button>
          <button 
            onClick={() => setShowScanner(true)}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-bold px-3.5 py-2 rounded-xl transition-colors shadow-sm"
          >
            <Camera size={14} /> {t.scanReceipt}
          </button>
        </div>
      </div>

      {/* 3. BENTO GRID CHARTS LAYER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Bento: Line history chart */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-sans font-bold text-sm text-slate-800 dark:text-slate-100">
                12-Month Historical Assets Progression
              </h4>
              <p className="text-[10px] text-slate-400 font-semibold uppercase">
                Consolidated Balance trajectory
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-lg">
              Asset Climb
            </span>
          </div>

          <div className="w-full h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineChartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#1E293B", borderRadius: "12px", border: "none", color: "#F8FAFC", fontSize: "11px" }}
                  labelStyle={{ fontWeight: "bold" }}
                />
                <Line type="monotone" dataKey="Balance" stroke="#10B981" strokeWidth={3} dot={{ r: 3, stroke: "#10B981", strokeWidth: 2, fill: "#fff" }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Bento: Financial Health score & circular gauge */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="font-sans font-bold text-sm text-slate-800 dark:text-slate-100">
              {t.financialHealthScore}
            </h4>
            <p className="text-[10px] text-slate-400 font-semibold uppercase">
              Consolidated vector standing
            </p>
          </div>

          {/* Elegant Circular Progress Gauge */}
          <div className="relative flex items-center justify-center my-6">
            <svg className="w-36 h-36 transform -rotate-90">
              {/* Background circle */}
              <circle
                cx="72"
                cy="72"
                r="60"
                stroke="#F1F5F9"
                strokeWidth="10"
                fill="transparent"
                className="dark:stroke-slate-800"
              />
              {/* Dynamic Progress indicator */}
              <circle
                cx="72"
                cy="72"
                r="60"
                stroke="#10B981"
                strokeWidth="10"
                fill="transparent"
                strokeDasharray={376.8}
                strokeDashoffset={376.8 - (376.8 * healthScore) / 100}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="font-sans font-extrabold text-3xl text-slate-800 dark:text-slate-100">
                {healthScore}
              </span>
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                / 100
              </span>
            </div>
          </div>

          <div className="text-center">
            <span className="text-xs font-extrabold text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 rounded-full uppercase tracking-wider">
              {data.healthScore?.rating || t.healthLabel}
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2.5 px-2">
              {healthLabelText}
            </p>
          </div>
        </div>

      </div>

      {/* 4. DUAL CHARTS COMPARISON ROW */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Income vs Expenses Comparison Bar chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm">
          <div>
            <h4 className="font-sans font-bold text-sm text-slate-800 dark:text-slate-100">
              Monthly Income vs Expenses
            </h4>
            <p className="text-[10px] text-slate-400 font-semibold uppercase mb-4">
              Cash flow comparison over past 6 months
            </p>
          </div>

          <div className="w-full h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#1E293B", borderRadius: "12px", border: "none", color: "#F8FAFC", fontSize: "11px" }}
                />
                <Bar dataKey="Income" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Expenses" fill="#EF4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Spending category donut chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="font-sans font-bold text-sm text-slate-800 dark:text-slate-100">
              Spending by Category
            </h4>
            <p className="text-[10px] text-slate-400 font-semibold uppercase mb-4">
              Categorical expense distributions this period
            </p>
          </div>

          <div className="grid grid-cols-12 gap-4 items-center">
            <div className="col-span-6 h-[170px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {donutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="col-span-6 space-y-1.5 overflow-y-auto max-h-[160px] pr-1 scrollbar-none">
              {donutData.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between text-[11px] font-semibold">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="w-2.5 h-2.5 rounded-md shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="text-slate-500 dark:text-slate-400 truncate">{item.name}</span>
                  </div>
                  <span className="text-slate-800 dark:text-slate-200 font-mono font-bold">
                    {formatCurrency(item.value, currency, language)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* 5. DUAL WIDGETS LOWER CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left lower: AI insights & Advisor Suggestions panel */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="text-emerald-500" size={16} />
                <h4 className="font-sans font-bold text-sm text-slate-800 dark:text-slate-100">
                  {t.aiFinancialAdvisor} insights
                </h4>
              </div>
              <button 
                onClick={() => setCurrentView(View.AIInsights)}
                className="text-xs text-emerald-500 hover:text-emerald-600 font-semibold flex items-center gap-0.5"
              >
                Advisor Chat <ChevronRight size={14} />
              </button>
            </div>

            <div className="space-y-4 mt-4">
              {data.transactions.length === 0 ? (
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {language === "ja"
                    ? "取引データがありません。口座や取引を追加すると、ここにアドバイスが表示されます。"
                    : "No activity yet. Add accounts and transactions to unlock personalized insights here."}
                </p>
              ) : (
                <>
                  <div className="flex gap-3 text-xs leading-relaxed">
                    <span className="p-1.5 bg-emerald-500/10 text-emerald-500 rounded-lg h-fit shrink-0 mt-0.5">💡</span>
                    <p className="text-slate-600 dark:text-slate-400 font-medium">
                      {language === "ja"
                        ? `今月の収入は ${formatCurrency(monthlyIncomeVal, currency, language)}、支出は ${formatCurrency(monthlyExpensesVal, currency, language)} です。`
                        : `This month you earned ${formatCurrency(monthlyIncomeVal, currency, language)} and spent ${formatCurrency(monthlyExpensesVal, currency, language)}.`}
                    </p>
                  </div>
                  <div className="flex gap-3 text-xs leading-relaxed">
                    <span className="p-1.5 bg-emerald-500/10 text-emerald-500 rounded-lg h-fit shrink-0 mt-0.5">📈</span>
                    <p className="text-slate-600 dark:text-slate-400 font-medium">
                      {language === "ja"
                        ? `貯蓄率は ${savingsRateVal}% です。詳細は AI Insights で確認できます。`
                        : `Your savings rate is ${savingsRateVal}%. Open AI Insights for deeper analysis.`}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right lower: Upcoming Bills & Urgency alarms */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h4 className="font-sans font-bold text-sm text-slate-800 dark:text-slate-100">
                Upcoming Bills
              </h4>
              <button 
                onClick={() => setCurrentView(View.Bills)}
                className="text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 font-semibold"
              >
                Calendar View <ChevronRight size={14} />
              </button>
            </div>

            <div className="space-y-3 mt-4">
              {data.bills.length === 0 ? (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {language === "ja" ? "予定されている請求はありません。" : "No upcoming bills."}
                </p>
              ) : (
                data.bills.slice(0, 3).map((bill) => (
                <div key={bill.id} className="flex items-center justify-between text-xs py-1.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${
                      bill.urgency === "high" ? "bg-red-500" : "bg-amber-500"
                    }`} />
                    <span className="text-slate-700 dark:text-slate-300 font-semibold truncate">{bill.name}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-bold text-slate-800 dark:text-slate-100">
                      {formatCurrency(bill.amount, currency, language)}
                    </span>
                    <span className="text-[9px] text-slate-400 block">Due {bill.dueDate}</span>
                  </div>
                </div>
              ))
              )}
            </div>
          </div>
        </div>

      </div>

      {/* 6. INVESTMENT SPARKLINES & BUDGET PREVIEWS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Budgets previews progress tracks */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <h4 className="font-sans font-bold text-sm text-slate-800 dark:text-slate-100">
              Active Category Budgets
            </h4>
            <button 
              onClick={() => setCurrentView(View.Budgets)}
              className="text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 font-semibold"
            >
              Set Limit <ChevronRight size={14} />
            </button>
          </div>

          <div className="space-y-3.5">
            {data.budgets.length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {language === "ja" ? "予算が未設定です。" : "No budgets set yet."}
              </p>
            ) : (
              data.budgets.map((b) => {
              const ratio = Math.min(100, Math.round((b.spent / b.limit) * 100)) || 0;
              return (
                <div key={b.id} className="space-y-1">
                  <div className="flex justify-between items-baseline text-xs">
                    <span className="text-slate-500 font-semibold">{translateCategory(b.category, language)}</span>
                    <span className="font-extrabold text-slate-700 dark:text-slate-300">
                      {formatCurrency(b.spent, currency, language)} <span className="text-slate-400 font-medium">of {formatCurrency(b.limit, currency, language)}</span>
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${ratio >= 80 ? "bg-red-500" : "bg-emerald-500"}`} 
                      style={{ width: `${ratio}%` }} 
                    />
                  </div>
                </div>
              );
            })
            )}
          </div>
        </div>

        {/* Savings Goals tracks previews */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <h4 className="font-sans font-bold text-sm text-slate-800 dark:text-slate-100">
              Savings Targets Pacing
            </h4>
            <button 
              onClick={() => setCurrentView(View.SavingsGoals)}
              className="text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 font-semibold"
            >
              Fund Targets <ChevronRight size={14} />
            </button>
          </div>

          <div className="space-y-3.5">
            {data.savingsGoals.length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {language === "ja" ? "貯蓄目標が未設定です。" : "No savings goals yet."}
              </p>
            ) : (
              data.savingsGoals.map((g) => {
              const pacing = Math.min(100, Math.round((g.saved / g.target) * 100)) || 0;
              return (
                <div key={g.id} className="space-y-1">
                  <div className="flex justify-between items-baseline text-xs">
                    <span className="text-slate-500 font-semibold">{g.name}</span>
                    <span className="font-extrabold text-slate-700 dark:text-slate-300">
                      {formatCurrency(g.saved, currency, language)} <span className="text-slate-400 font-medium">of {formatCurrency(g.target, currency, language)}</span>
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div className="h-full rounded-full bg-emerald-500" style={{ width: `${pacing}%` }} />
                  </div>
                </div>
              );
            })
            )}
          </div>
        </div>

      </div>

      {/* 7. HIGH-FIDELITY RECENT TRANSACTIONS TABLE */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
          <h4 className="font-sans font-bold text-sm text-slate-800 dark:text-slate-100">
            {t.recentTransactions}
          </h4>
          <button 
            onClick={() => setCurrentView(View.Transactions)}
            className="text-xs text-emerald-500 hover:text-emerald-600 font-semibold"
          >
            Full Ledger View
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                <th className="pb-2.5">{t.merchant}</th>
                <th className="pb-2.5">{t.category}</th>
                <th className="pb-2.5">{t.paymentMethod}</th>
                <th className="pb-2.5">{t.status}</th>
                <th className="pb-2.5 text-right">{t.amount}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {data.transactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500 dark:text-slate-400">
                    {language === "ja" ? "取引がありません。" : "No transactions yet."}
                  </td>
                </tr>
              ) : (
                data.transactions.slice(0, 5).map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/[0.01]">
                  <td className="py-3 font-bold text-slate-800 dark:text-slate-200">{tx.merchant}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {translateCategory(tx.category, language)}
                    </span>
                  </td>
                  <td className="py-3 text-slate-400">{tx.paymentMethod}</td>
                  <td className="py-3">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      <CheckCircle size={10} /> completed
                    </span>
                  </td>
                  <td className="py-3 text-right font-extrabold font-mono text-slate-800 dark:text-slate-200">
                    {tx.type === "income" ? "+" : "-"}
                    {formatCurrency(tx.amount, currency, language)}
                  </td>
                </tr>
              ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
