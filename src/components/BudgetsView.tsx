import React, { useState } from "react";
import { FinanceData, Budget, Language } from "../types";
import { translations, formatCurrency, translateCategory } from "../lib/translations";
import { 
  PieChart, 
  Plus, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingDown, 
  ArrowRight,
  Info
} from "lucide-react";

interface BudgetsViewProps {
  data: FinanceData;
  language: Language;
  currency?: string;
  onUpdateData: (data: FinanceData) => void;
}

export default function BudgetsView({
  data,
  language,
  currency = "USD",
  onUpdateData
}: BudgetsViewProps) {
  const t = translations[language];
  const [showAddBudget, setShowAddBudget] = useState(false);
  const [category, setCategory] = useState("Food");
  const [limit, setLimit] = useState("");

  const handleSetBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !limit) return;

    try {
      const response = await fetch("/api/finance/budget", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          limit: parseFloat(limit)
        })
      });

      if (response.ok) {
        const freshData = await response.json();
        onUpdateData(freshData);
        setLimit("");
        setShowAddBudget(false);
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
            {t.budgets}
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
            {t.budgetsSubtitle}
          </p>
        </div>

        <button
          onClick={() => setShowAddBudget(!showAddBudget)}
          className="flex items-center gap-1.5 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 font-semibold text-xs py-1.5 px-3 rounded-xl transition-colors shadow-sm"
        >
          <Plus size={14} /> {t.setLimit}
        </button>
      </div>

      {showAddBudget && (
        <form 
          onSubmit={handleSetBudget}
          className="p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl shadow-sm space-y-4 max-w-md"
        >
          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            {t.configureBudget}
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block uppercase tracking-wider mb-1">
                {t.category}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 text-slate-800 dark:text-slate-100 focus:outline-none"
              >
                <option value="Food">{t.food}</option>
                <option value="Shopping">{t.shopping}</option>
                <option value="Transportation">{t.transport}</option>
                <option value="Entertainment">{t.entertainment}</option>
                <option value="Utilities">{t.utilities}</option>
                <option value="Healthcare">{t.healthcare}</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block uppercase tracking-wider mb-1">
                {t.limitAmount}
              </label>
              <input
                type="number"
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                placeholder={t.limitAmount}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 text-slate-800 dark:text-slate-100 focus:outline-none"
                required
              />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => setShowAddBudget(false)}
              className="text-xs px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="text-xs px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold"
            >
              {t.updateBudget}
            </button>
          </div>
        </form>
      )}

      {/* Budgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {data.budgets.map((b) => {
          const percent = Math.min(100, Math.round((b.spent / b.limit) * 100)) || 0;
          const isOver = b.spent > b.limit;
          const remaining = Math.max(0, b.limit - b.spent);

          return (
            <div 
              key={b.id}
              className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 block">
                    {translateCategory(b.category, language)} {t.budgetSuffix}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">
                    {t.monthlyPeriod}
                  </span>
                </div>
                <div className={`p-2 rounded-xl ${
                  isOver 
                    ? "bg-red-500/10 text-red-500" 
                    : percent >= 80 
                    ? "bg-amber-500/10 text-amber-500" 
                    : "bg-emerald-500/10 text-emerald-500"
                }`}>
                  <PieChart size={16} />
                </div>
              </div>

              {/* Progress and numbers */}
              <div className="space-y-1.5">
                <div className="flex items-baseline justify-between text-xs">
                  <span className="text-slate-400 font-medium">{t.spent}</span>
                  <span className="font-extrabold text-slate-800 dark:text-slate-100">
                    {formatCurrency(b.spent, currency, language)} <span className="text-slate-400 font-medium">{t.ofAmount} {formatCurrency(b.limit, currency, language)}</span>
                  </span>
                </div>

                {/* Modern Progress Track bar */}
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ease-out ${
                      isOver 
                        ? "bg-red-500" 
                        : percent >= 80 
                        ? "bg-amber-500" 
                        : "bg-emerald-500"
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>

              {/* Additional Alerts info */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-[10px] font-bold">
                <span className="text-slate-400">
                  {isOver ? t.overBudget : `${100 - percent}${t.remainingPercent}`}
                </span>
                <span className={`flex items-center gap-1 ${
                  isOver ? "text-red-500" : percent >= 80 ? "text-amber-500" : "text-emerald-500"
                }`}>
                  {isOver ? (
                    <>
                      <AlertTriangle size={12} /> -{formatCurrency(b.spent - b.limit, currency, language)}
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={12} /> {formatCurrency(remaining, currency, language)} {t.left}
                    </>
                  )}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Explanatory Info Card */}
      <div className="p-4 rounded-xl border border-slate-150 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/20 flex gap-3 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
        <Info size={16} className="text-emerald-500 shrink-0 mt-0.5" />
        <p>
          {t.budgetsInfo}
        </p>
      </div>

    </div>
  );
}
