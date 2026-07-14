import { useState, useEffect } from "react";
import { View, Language, FinanceData } from "./types";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import DashboardView from "./components/DashboardView";
import AccountsView from "./components/AccountsView";
import TransactionsView from "./components/TransactionsView";
import BudgetsView from "./components/BudgetsView";
import SavingsGoalsView from "./components/SavingsGoalsView";
import InvestmentsView from "./components/InvestmentsView";
import BillsView from "./components/BillsView";
import AIInsightsView from "./components/AIInsightsView";
import AnalyticsView from "./components/AnalyticsView";
import ReportsView from "./components/ReportsView";
import SettingsView from "./components/SettingsView";
import { Loader2 } from "lucide-react";

export default function App() {
  const [currentView, setCurrentView] = useState<View>(View.Dashboard);
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem("elysian_lang") as Language) || "en";
  });
  const [currency, setCurrency] = useState<string>(() => {
    return localStorage.getItem("elysian_currency") || "USD";
  });
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState<any[]>([]);
  const [data, setData] = useState<FinanceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch financial dataset from Express backend database
  const fetchFinanceData = async () => {
    try {
      const response = await fetch("/api/finance");
      if (response.ok) {
        const json = await response.json();
        setData(json);
      }
    } catch (err) {
      console.error("Failed to load financial records:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFinanceData();
  }, []);

  // Update theme on HTML body for Tailwind dark mode
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("elysian_lang", lang);
  };

  const handleCurrencyChange = (curr: string) => {
    setCurrency(curr);
    localStorage.setItem("elysian_currency", curr);
  };

  const handleUpdateData = (updated: FinanceData) => {
    setData(updated);
  };

  if (isLoading || !data) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center">
        <Loader2 className="text-emerald-500 animate-spin mb-4" size={32} />
        <span className="text-xs font-mono font-bold text-slate-500 tracking-wider">
          ESTABLISHING ELYSIAN COGNITIVE ENVELOPE...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      
      {/* Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        language={language}
        isCollapsed={sidebarCollapsed}
        setIsCollapsed={setSidebarCollapsed}
        isDbConnected={data.dbConfig.isConnected}
      />

      {/* Main Panel Content Wrap */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Global header navigation utilities */}
        <Header
          language={language}
          setLanguage={handleLanguageChange}
          currency={currency}
          setCurrency={handleCurrencyChange}
          darkMode={theme === "dark"}
          setDarkMode={(dark) => setTheme(dark ? "dark" : "light")}
          notifications={notifications}
          setNotifications={setNotifications}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Dynamic Route View Mount */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {currentView === View.Dashboard && (
            <DashboardView
              data={data}
              language={language}
              currency={currency}
              onUpdateData={handleUpdateData}
              setCurrentView={setCurrentView}
            />
          )}

          {currentView === View.Accounts && (
            <AccountsView
              data={data}
              language={language}
              currency={currency}
              onUpdateData={handleUpdateData}
            />
          )}

          {currentView === View.Transactions && (
            <TransactionsView
              data={data}
              language={language}
              onUpdateData={handleUpdateData}
            />
          )}

          {currentView === View.Budgets && (
            <BudgetsView
              data={data}
              language={language}
              onUpdateData={handleUpdateData}
            />
          )}

          {currentView === View.SavingsGoals && (
            <SavingsGoalsView
              data={data}
              language={language}
              onUpdateData={handleUpdateData}
            />
          )}

          {currentView === View.Investments && (
            <InvestmentsView
              data={data}
              language={language}
              onUpdateData={handleUpdateData}
            />
          )}

          {currentView === View.Bills && (
            <BillsView
              data={data}
              language={language}
              onUpdateData={handleUpdateData}
            />
          )}

          {currentView === View.Analytics && (
            <AnalyticsView
              data={data}
              language={language}
            />
          )}

          {currentView === View.AIInsights && (
            <AIInsightsView
              data={data}
              language={language}
              onUpdateData={handleUpdateData}
            />
          )}

          {currentView === View.Reports && (
            <ReportsView
              data={data}
              language={language}
            />
          )}

          {currentView === View.Settings && (
            <SettingsView
              data={data}
              language={language}
              onUpdateData={handleUpdateData}
            />
          )}
        </main>
      </div>

    </div>
  );
}
