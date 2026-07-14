import React, { useState } from "react";
import { FinanceData, Language } from "../types";
import { translations, formatCurrency } from "../lib/translations";
import { 
  Settings, 
  User, 
  Bell, 
  Lock, 
  HelpCircle, 
  ShieldCheck, 
  Trash2,
  CheckCircle2
} from "lucide-react";

interface SettingsViewProps {
  data: FinanceData;
  language: Language;
  onUpdateData: (data: FinanceData) => void;
}

export default function SettingsView({
  data,
  language,
  onUpdateData
}: SettingsViewProps) {
  const t = translations[language];
  const [name, setName] = useState("Alex Harrison");
  const [email, setEmail] = useState("alex.harrison@elysian.com");
  const [phone, setPhone] = useState("+1 (555) 902-1845");

  const [enableAlerts, setEnableAlerts] = useState(true);
  const [autoDeduction, setAutoDeduction] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(true);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleResetApp = async () => {
    if (!confirm("Are you sure you want to restore the local database to the initial default state? This will clear custom transactions and credentials.")) {
      return;
    }

    try {
      const response = await fetch("/api/finance/reset", {
        method: "POST"
      });

      if (response.ok) {
        const resetData = await response.json();
        onUpdateData(resetData);
        alert("Local database reset to standard default values!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in select-none">
      
      <div>
        <h3 className="font-sans font-bold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Settings className="text-emerald-500" size={18} />
          Profile & Application Settings
        </h3>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
          Manage profile settings, custom integrations, alert preferences, and sandboxed storage states
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Profile Card left */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm">
          <h4 className="text-xs font-bold text-slate-850 dark:text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-2">
            <User size={14} className="text-emerald-500" /> Personal Account Identity
          </h4>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 font-semibold"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 font-semibold"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block uppercase tracking-wider mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 font-semibold"
              />
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-slate-800">
              {savedSuccess ? (
                <span className="text-xs font-semibold text-emerald-500 flex items-center gap-1">
                  <CheckCircle2 size={14} /> Profile details saved securely!
                </span>
              ) : (
                <span />
              )}
              <button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs py-2 px-4 rounded-xl shadow-md transition-colors"
              >
                Save Identity Details
              </button>
            </div>
          </form>
        </div>

        {/* Preferences & System Reset card right */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm space-y-4">
            <h4 className="text-xs font-bold text-slate-850 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Bell size={14} className="text-emerald-500" /> Notifications & Limits
            </h4>

            <div className="space-y-3.5 text-xs">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-semibold text-slate-700 dark:text-slate-300 block">Push Smart Alerts</span>
                  <span className="text-[10px] text-slate-400">Trigger warnings when budgets hit 80% limit</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={enableAlerts} 
                  onChange={(e) => setEnableAlerts(e.target.checked)} 
                  className="rounded text-emerald-500 focus:ring-emerald-500 w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-semibold text-slate-700 dark:text-slate-300 block">Automated Bill Pay</span>
                  <span className="text-[10px] text-slate-400">Auto-draft high-priority utility invoices</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={autoDeduction} 
                  onChange={(e) => setAutoDeduction(e.target.checked)} 
                  className="rounded text-emerald-500 focus:ring-emerald-500 w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-semibold text-slate-700 dark:text-slate-300 block">Weekly Digests</span>
                  <span className="text-[10px] text-slate-400">Email consolidated statements every Friday</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={weeklyReports} 
                  onChange={(e) => setWeeklyReports(e.target.checked)} 
                  className="rounded text-emerald-500 focus:ring-emerald-500 w-4 h-4"
                />
              </label>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-red-500 uppercase tracking-wider flex items-center gap-2">
              <Trash2 size={14} /> Danger Zone
            </h4>
            <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
              Reset the local PostgreSQL database back to original defaults. All custom expenditures, newly established targets, and connection metadata will be permanently wiped.
            </p>
            <button
              onClick={handleResetApp}
              className="w-full py-2 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400 font-bold text-xs rounded-xl border border-red-200/50 dark:border-red-900/50 transition-colors"
            >
              Reset Sandboxed Database
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
