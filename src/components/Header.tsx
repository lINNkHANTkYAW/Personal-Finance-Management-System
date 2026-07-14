import { useState } from "react";
import { Language } from "../types";
import { translations } from "../lib/translations";
import { 
  Bell, 
  Search, 
  Sun, 
  Moon, 
  Globe, 
  AlertCircle, 
  CheckCircle, 
  DollarSign, 
  Percent,
  X,
  LogOut
} from "lucide-react";

interface HeaderProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  currency: string;
  setCurrency: (curr: string) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  notifications: any[];
  setNotifications: (notifs: any[]) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  user?: { name: string; email: string } | null;
  onLogout?: () => void;
}

export default function Header({
  language,
  setLanguage,
  currency,
  setCurrency,
  darkMode,
  setDarkMode,
  notifications,
  setNotifications,
  searchQuery,
  setSearchQuery,
  user,
  onLogout
}: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const t = translations[language];

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleClearNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <header className="h-16 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-40 select-none">
      {/* Search Input Container */}
      <div className="relative w-80 max-w-xs md:max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={16} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t.searchPlaceholder}
          className="w-full pl-10 pr-4 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 hover:bg-slate-50 dark:hover:bg-slate-950 focus:bg-white dark:focus:bg-slate-950 text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200"
        />
      </div>

      {/* Top Navigation Right Controls */}
      <div className="flex items-center gap-4">
        
        {/* Modern Segmented Language Switcher Toggle */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
          <div className="pl-2 pr-0.5 text-slate-400 dark:text-slate-500">
            <Globe size={14} className="animate-spin-slow" />
          </div>
          <button
            onClick={() => setLanguage("en")}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all duration-200 ${
              language === "en"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm"
                : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage("ja")}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all duration-200 ${
              language === "ja"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm"
                : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            日本語
          </button>
        </div>

        {/* Currency Selector */}
        <div className="relative">
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="appearance-none bg-slate-100 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 rounded-xl px-3 py-1.5 pr-8 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 cursor-pointer shadow-sm"
          >
            <option value="USD">USD ($)</option>
            <option value="JPY">JPY (¥)</option>
          </select>
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 dark:text-slate-500 text-[10px]">▼</span>
        </div>

        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-xl border border-slate-200/50 dark:border-slate-800/50 bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors shadow-sm"
          title={darkMode ? t.lightMode : t.darkMode}
        >
          {darkMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Notification Bell with Badge & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl border border-slate-200/50 dark:border-slate-800/50 bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors relative shadow-sm"
          >
            <Bell size={16} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900 animate-pulse" />
            )}
          </button>

          {/* Notifications Panel */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 md:w-96 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-950 shadow-xl overflow-hidden z-50 animate-fade-in">
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
                <span className="font-sans font-bold text-sm text-slate-800 dark:text-slate-100">
                  {t.notifications} ({unreadCount})
                </span>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-sm">
                    No active notifications.
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-4 flex gap-3 transition-colors duration-150 ${
                        notif.read ? "bg-transparent" : "bg-emerald-50/15 dark:bg-emerald-500/5"
                      }`}
                    >
                      <div className="shrink-0 mt-0.5">
                        {notif.type === "warning" ? (
                          <AlertCircle size={16} className="text-amber-500" />
                        ) : notif.type === "success" ? (
                          <CheckCircle size={16} className="text-emerald-500" />
                        ) : (
                          <AlertCircle size={16} className="text-blue-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs text-slate-700 dark:text-slate-300 ${!notif.read ? "font-medium" : ""}`}>
                          {notif.message}
                        </p>
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          {notif.time}
                        </span>
                      </div>
                      <button
                        onClick={() => handleClearNotification(notif.id)}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 self-start p-0.5 rounded-md hover:bg-slate-50 dark:hover:bg-slate-900"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Info & Logout */}
        <div className="flex items-center gap-3 pl-2 border-l border-slate-200 dark:border-slate-800">
          <div className="flex flex-col text-right hidden sm:flex">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {user?.name || "Guest"}
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500">
              {user?.email || "Not signed in"}
            </span>
          </div>
          <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs font-extrabold ring-2 ring-slate-100 dark:ring-slate-800 shrink-0">
            {(user?.name || "U").charAt(0).toUpperCase()}
          </div>
          {onLogout && (
            <button
              onClick={onLogout}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 text-xs font-bold transition-colors shadow-sm shrink-0"
            >
              <LogOut size={14} />
              <span>Log out</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
}
