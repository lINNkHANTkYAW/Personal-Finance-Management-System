import { useState, useEffect } from "react";
import { View, Language, FinanceData } from "./types";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import AuthPage, { type SessionUser } from "./components/AuthPage";
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
  const [user, setUser] = useState<SessionUser | null>(null);
  const [data, setData] = useState<FinanceData | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchFinanceData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/finance", { credentials: "include" });
      if (response.status === 401) {
        setUser(null);
        setData(null);
        return;
      }
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
    const boot = async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        if (res.ok) {
          const body = await res.json();
          if (body.user) {
            setUser(body.user);
          }
        }
      } catch (err) {
        console.error("Auth check failed:", err);
      } finally {
        setAuthChecked(true);
      }
    };
    boot();
  }, []);

  useEffect(() => {
    if (user) {
      fetchFinanceData();
    } else {
      setData(null);
    }
  }, [user]);

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

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error(err);
    } finally {
      setUser(null);
      setData(null);
      setCurrentView(View.Dashboard);
    }
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center">
        <Loader2 className="text-emerald-500 animate-spin mb-4" size={32} />
        <span className="text-xs font-mono font-bold text-slate-500 tracking-wider">
          CHECKING SESSION...
        </span>
      </div>
    );
  }

  if (!user) {
    return <AuthPage onAuthenticated={setUser} />;
  }

  if (isLoading || !data) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center">
        <Loader2 className="text-emerald-500 animate-spin mb-4" size={32} />
        <span className="text-xs font-mono font-bold text-slate-500 tracking-wider">
          LOADING YOUR WORKSPACE...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        language={language}
        isCollapsed={sidebarCollapsed}
        setIsCollapsed={setSidebarCollapsed}
        isDbConnected={data.dbConfig.isConnected}
      />

      <div className="flex-1 flex flex-col min-w-0">
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
          user={user}
          onLogout={handleLogout}
        />

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
            <AnalyticsView data={data} language={language} />
          )}

          {currentView === View.AIInsights && (
            <AIInsightsView
              data={data}
              language={language}
              onUpdateData={handleUpdateData}
            />
          )}

          {currentView === View.Reports && (
            <ReportsView data={data} language={language} currency={currency} />
          )}

          {currentView === View.Settings && (
            <SettingsView
              data={data}
              language={language}
              onUpdateData={handleUpdateData}
              onLogout={handleLogout}
            />
          )}
        </main>
      </div>
    </div>
  );
}
