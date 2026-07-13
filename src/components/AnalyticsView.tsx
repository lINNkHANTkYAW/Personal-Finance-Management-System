import { useState } from "react";
import { FinanceData, Language } from "../types";
import { translations, formatCurrency, translateCategory } from "../lib/translations";
import { 
  BarChart as RechartBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from "recharts";
import { 
  TrendingUp, 
  Activity, 
  PieChart, 
  BarChart3, 
  Maximize2,
  Calendar,
  Share2
} from "lucide-react";

interface AnalyticsViewProps {
  data: FinanceData;
  language: Language;
}

export default function AnalyticsView({
  data,
  language
}: AnalyticsViewProps) {
  const t = translations[language];
  const [timeframe, setTimeframe] = useState<"6m" | "1y">("6m");

  const cashFlowTrendData = [
    { name: "Jan", NetCashflow: 1500, CumulativeSavings: 1500 },
    { name: "Feb", NetCashflow: 1600, CumulativeSavings: 3100 },
    { name: "Mar", NetCashflow: 1800, CumulativeSavings: 4900 },
    { name: "Apr", NetCashflow: 1900, CumulativeSavings: 6800 },
    { name: "May", NetCashflow: 2100, CumulativeSavings: 8900 },
    { name: "Jun", NetCashflow: 2200, CumulativeSavings: 11100 },
    { name: "Jul", NetCashflow: 2295, CumulativeSavings: 13395 },
  ];

  const categoricalPieData = [
    { category: "Food", amount: 450, percentage: 14.4 },
    { category: "Shopping", amount: 320, percentage: 10.2 },
    { category: "Housing", amount: 1850, percentage: 59.2 },
    { category: "Transportation", amount: 110, percentage: 3.5 },
    { category: "Utilities", amount: 230.2, percentage: 7.3 },
    { category: "Entertainment", amount: 30.98, percentage: 1.0 },
  ];

  return (
    <div className="space-y-6 animate-fade-in select-none">
      
      {/* Top filter headers */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-sans font-bold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <BarChart3 className="text-emerald-500" size={18} />
            Analytics Intelligence
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
            Evaluate assets growth vectors, liquidity metrics, and cash velocity
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200/50 dark:border-slate-800 text-xs font-semibold">
            <button 
              onClick={() => setTimeframe("6m")}
              className={`px-3 py-1 rounded-lg ${timeframe === "6m" ? "bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 shadow-sm" : "text-slate-400"}`}
            >
              6 Months
            </button>
            <button 
              onClick={() => setTimeframe("1y")}
              className={`px-3 py-1 rounded-lg ${timeframe === "1y" ? "bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 shadow-sm" : "text-slate-400"}`}
            >
              1 Year
            </button>
          </div>
        </div>
      </div>

      {/* Main Analytics Cards layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Cumulative Savings Area Chart */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-bold text-slate-850 dark:text-slate-200 uppercase tracking-wider">
              Cumulative Assets & Savings Growth Curve
            </h4>
            <span className="p-1.5 bg-emerald-500/10 text-emerald-500 rounded-lg">
              <Activity size={14} />
            </span>
          </div>

          <div className="w-full h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cashFlowTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="CumulativeSavings" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSavings)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categorical breakdown table with indicators */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold text-slate-850 dark:text-slate-200 uppercase tracking-wider mb-3">
              Liquidity Category Burn
            </h4>
            
            <div className="space-y-3">
              {categoricalPieData.map((item) => (
                <div key={item.category} className="text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-slate-500 font-semibold">{translateCategory(item.category, language)}</span>
                    <span className="font-extrabold text-slate-700 dark:text-slate-300">
                      {formatCurrency(item.amount, "USD", language)} ({item.percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${item.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button className="w-full mt-4 py-2 bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-slate-800 rounded-xl flex items-center justify-center gap-1.5 transition-colors">
            <Share2 size={14} className="text-emerald-500" /> Export Metric Models
          </button>
        </div>

      </div>

    </div>
  );
}
