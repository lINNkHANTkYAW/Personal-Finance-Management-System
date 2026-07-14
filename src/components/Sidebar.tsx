import { useState } from "react";
import { View, Language } from "../types";
import { translations } from "../lib/translations";
import { 
  LayoutDashboard, 
  Wallet, 
  ArrowUpDown, 
  PieChart, 
  PiggyBank, 
  TrendingUp, 
  Calendar, 
  LineChart, 
  Bot, 
  FileText, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  TrendingDown,
  Database
} from "lucide-react";

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  language: Language;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isDbConnected: boolean;
}

export default function Sidebar({
  currentView,
  setCurrentView,
  language,
  isCollapsed,
  setIsCollapsed,
  isDbConnected
}: SidebarProps) {
  const t = translations[language];

  // Map of Views to Icons
  const navigationItems = [
    { view: View.Dashboard, label: t.dashboard, icon: LayoutDashboard },
    { view: View.Accounts, label: t.accounts, icon: Wallet },
    { view: View.Transactions, label: t.transactions, icon: ArrowUpDown },
    { view: View.Budgets, label: t.budgets, icon: PieChart },
    { view: View.SavingsGoals, label: t.savingsGoals, icon: PiggyBank },
    { view: View.Investments, label: t.investments, icon: TrendingUp },
    { view: View.Bills, label: t.bills, icon: Calendar },
    { view: View.Analytics, label: t.analytics, icon: LineChart },
    { view: View.AIInsights, label: t.aiInsights, icon: Bot },
    { view: View.Reports, label: t.reports, icon: FileText },
    { view: View.Settings, label: t.settings, icon: Settings },
  ];

  return (
    <aside 
      className={`relative flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-300 ease-in-out select-none shrink-0 ${
        isCollapsed ? "w-20" : "w-52"
      }`}
    >
      {/* Sidebar Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-bold shrink-0 shadow-sm shadow-emerald-500/10">
            E
          </div>
          {!isCollapsed && (
            <span className="font-sans font-bold tracking-tight text-lg text-slate-900 dark:text-white whitespace-nowrap">
              Elysian
            </span>
          )}
        </div>
        
        {/* Toggle Collapse Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex p-1 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto scrollbar-none">
        {navigationItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = currentView === item.view;
          return (
            <button
              key={item.view}
              onClick={() => setCurrentView(item.view)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 group relative ${
                isActive
                  ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400"
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-100"
              }`}
            >
              <IconComponent 
                size={16} 
                className={`shrink-0 transition-transform duration-200 group-hover:scale-105 ${
                  isActive ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                }`}
              />
              {!isCollapsed && (
                <span className="truncate">{item.label}</span>
              )}
              {isActive && !isCollapsed && (
                <span className="absolute right-3 w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
              )}
              
              {/* Tooltip for Collapsed Sidebar */}
              {isCollapsed && (
                <div className="absolute left-14 invisible opacity-0 group-hover:visible group-hover:opacity-100 z-50 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs py-1.5 px-3 rounded-lg font-medium shadow-md transition-all duration-200 whitespace-nowrap pointer-events-none translation-transform">
                  {item.label}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Database Status Indicator Footer */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800">
        {isCollapsed ? (
          <div className="flex justify-center p-2 bg-slate-900 dark:bg-slate-950 rounded-xl text-white">
            <span className={`w-2 h-2 rounded-full ${isDbConnected ? "bg-emerald-400" : "bg-orange-400"}`} />
          </div>
        ) : (
          <div className="bg-slate-900 dark:bg-slate-950 rounded-xl p-3 text-white text-xs">
            <p className="opacity-70 text-[10px] uppercase tracking-wider font-semibold">{t.dbConnection}</p>
            <p className="font-mono mt-1 text-emerald-400 flex items-center gap-1.5 font-semibold">
              <span className={`w-1.5 h-1.5 rounded-full ${isDbConnected ? "bg-emerald-400 animate-pulse" : "bg-orange-400"}`} />
              {isDbConnected ? t.dockerPostgres : t.dbOffline}
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
