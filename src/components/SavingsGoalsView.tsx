import React, { useState } from "react";
import { FinanceData, SavingsGoal, Language } from "../types";
import { translations, formatCurrency } from "../lib/translations";
import { 
  PiggyBank, 
  Plus, 
  ArrowUpRight, 
  Target, 
  Sparkles,
  DollarSign
} from "lucide-react";

interface SavingsGoalsViewProps {
  data: FinanceData;
  language: Language;
  onUpdateData: (data: FinanceData) => void;
}

export default function SavingsGoalsView({
  data,
  language,
  onUpdateData
}: SavingsGoalsViewProps) {
  const t = translations[language];
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [goalName, setGoalName] = useState("");
  const [goalTarget, setGoalTarget] = useState("");
  const [goalSaved, setGoalSaved] = useState("");

  const [contributeGoalId, setContributeGoalId] = useState<string | null>(null);
  const [contributeAmount, setContributeAmount] = useState("");

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalName || !goalTarget) return;

    try {
      const response = await fetch("/api/finance/goal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: goalName,
          target: parseFloat(goalTarget),
          saved: parseFloat(goalSaved) || 0
        })
      });

      if (response.ok) {
        const freshData = await response.json();
        onUpdateData(freshData);
        setGoalName("");
        setGoalTarget("");
        setGoalSaved("");
        setShowAddGoal(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleContribute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contributeGoalId || !contributeAmount) return;

    const amt = parseFloat(contributeAmount);
    if (isNaN(amt) || amt <= 0) return;

    const goal = data.savingsGoals.find(g => g.id === contributeGoalId);
    if (!goal) return;

    // Deduct from checking, add to goal, add transaction
    const newSaved = goal.saved + amt;
    
    // We can update the goal via endpoint, and also deduct from checking
    const updatedGoals = data.savingsGoals.map(g => {
      if (g.id === contributeGoalId) {
        return { ...g, saved: newSaved };
      }
      return g;
    });

    const checkingAccount = data.accounts.find(a => a.type === "checking");
    const updatedAccounts = data.accounts.map(a => {
      if (a.type === "checking") {
        return { ...a, balance: Math.max(0, a.balance - amt) };
      }
      if (a.type === "savings") {
        return { ...a, balance: a.balance + amt };
      }
      return a;
    });

    // Create record transaction
    const newTx = {
      id: `tx-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      merchant: `Transfer to ${goal.name}`,
      category: "Savings",
      paymentMethod: "Internal Transfer",
      amount: amt,
      status: "completed" as const,
      type: "expense" as const
    };

    const updatedData: FinanceData = {
      ...data,
      savingsGoals: updatedGoals,
      accounts: updatedAccounts,
      transactions: [newTx, ...data.transactions]
    };

    try {
      const response = await fetch("/api/finance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData)
      });

      if (response.ok) {
        const fresh = await response.json();
        onUpdateData(fresh);
        setContributeAmount("");
        setContributeGoalId(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in select-none">
      
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-sans font-bold text-base text-slate-800 dark:text-slate-100">
            {t.savingsGoals}
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
            Define savings objectives, track percentage progress, and invest in plans
          </p>
        </div>

        <button
          onClick={() => setShowAddGoal(!showAddGoal)}
          className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs py-1.5 px-3 rounded-xl transition-all shadow-sm"
        >
          <Plus size={14} /> New Goal
        </button>
      </div>

      {showAddGoal && (
        <form 
          onSubmit={handleCreateGoal}
          className="p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl shadow-sm space-y-4 max-w-md"
        >
          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Establish Financial Objective
          </h4>
          <div className="space-y-3">
            <div>
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block uppercase tracking-wider mb-1">
                Goal Name
              </label>
              <input
                type="text"
                value={goalName}
                onChange={(e) => setGoalName(e.target.value)}
                placeholder="e.g. Dream Vacation, New Car"
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 text-slate-800 dark:text-slate-100 focus:outline-none"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block uppercase tracking-wider mb-1">
                  Target Amount ($)
                </label>
                <input
                  type="number"
                  value={goalTarget}
                  onChange={(e) => setGoalTarget(e.target.value)}
                  placeholder="Target Value"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 text-slate-800 dark:text-slate-100 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block uppercase tracking-wider mb-1">
                  Already Saved ($)
                </label>
                <input
                  type="number"
                  value={goalSaved}
                  onChange={(e) => setGoalSaved(e.target.value)}
                  placeholder="Initial Deposit"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 text-slate-800 dark:text-slate-100 focus:outline-none"
                />
              </div>
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => setShowAddGoal(false)}
              className="text-xs px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="text-xs px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold"
            >
              Establish Goal
            </button>
          </div>
        </form>
      )}

      {/* Contribution Form Triggered dynamically */}
      {contributeGoalId && (
        <form 
          onSubmit={handleContribute}
          className="p-5 border border-emerald-200 bg-emerald-50/20 dark:border-emerald-900/50 dark:bg-emerald-950/10 rounded-2xl max-w-sm"
        >
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400">
              Contribute Savings Funds
            </span>
            <button 
              type="button" 
              onClick={() => setContributeGoalId(null)}
              className="text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              ✕
            </button>
          </div>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 mb-3">
            Transfer money directly from Chase Checking to Marcus Savings for this goal.
          </p>
          <div className="relative">
            <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="number"
              value={contributeAmount}
              onChange={(e) => setContributeAmount(e.target.value)}
              placeholder="Contribution amount ($)"
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full mt-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs rounded-xl shadow-md transition-colors"
          >
            Confirm Contribution Transfer
          </button>
        </form>
      )}

      {/* Savings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {data.savingsGoals.map((g) => {
          const percent = Math.min(100, Math.round((g.saved / g.target) * 100)) || 0;

          return (
            <div 
              key={g.id}
              className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="font-sans font-bold text-sm text-slate-800 dark:text-slate-200">
                      {g.name === "Emergency Fund" ? t.emergencyFund : g.name === "Vacation" ? t.vacation : g.name === "New Laptop" ? t.newLaptop : g.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold block uppercase">
                      Target Date: {g.targetDate}
                    </span>
                  </div>
                  <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-xl">
                    <PiggyBank size={16} />
                  </div>
                </div>

                {/* Progress bar info */}
                <div className="space-y-1.5">
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="text-slate-400 font-medium">Saved</span>
                    <span className="font-extrabold text-slate-800 dark:text-slate-100">
                      {formatCurrency(g.saved, "USD", language)} <span className="text-slate-400 font-medium">of {formatCurrency(g.target, "USD", language)}</span>
                    </span>
                  </div>
                  
                  {/* Track */}
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-emerald-500 transition-all duration-500 ease-out"
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
                    <span>{percent}% Complete</span>
                    {percent >= 100 && (
                      <span className="text-emerald-500 flex items-center gap-0.5">
                        <Sparkles size={10} /> Fully Funded!
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <button
                onClick={() => setContributeGoalId(g.id)}
                className="w-full mt-4 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center justify-center gap-1.5 transition-colors"
              >
                <ArrowUpRight size={14} className="text-emerald-500" /> Contribute Funds
              </button>
            </div>
          );
        })}
      </div>

    </div>
  );
}
