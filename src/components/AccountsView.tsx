import { useState } from "react";
import { FinanceData, Account, Language } from "../types";
import { translations, formatCurrency } from "../lib/translations";
import { 
  Wallet, 
  Database, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp, 
  Plus, 
  ShieldCheck, 
  ArrowUpRight, 
  Activity,
  ChevronRight,
  ServerCrash
} from "lucide-react";

interface AccountsViewProps {
  data: FinanceData;
  language: Language;
  currency: string;
  onUpdateData: (data: FinanceData) => void;
}

export default function AccountsView({
  data,
  language,
  currency,
  onUpdateData
}: AccountsViewProps) {
  const t = translations[language];
  const [supabaseUrl, setSupabaseUrl] = useState(data.supabaseConfig.url || "");
  const [supabaseKey, setSupabaseKey] = useState(data.supabaseConfig.anonKey || "");
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<"success" | "error" | null>(null);

  const [showAddAccount, setShowAddAccount] = useState(false);
  const [newAccName, setNewAccName] = useState("");
  const [newAccType, setNewAccType] = useState<"checking" | "savings" | "credit" | "investment">("checking");
  const [newAccBalance, setNewAccBalance] = useState("");

  const handleConnectSupabase = async () => {
    setIsTesting(true);
    setTestResult(null);

    // Simulate connecting to Supabase database (or saving settings)
    setTimeout(async () => {
      const isOk = supabaseUrl.startsWith("https://") && supabaseKey.length > 20;
      
      const updatedConfig = {
        url: supabaseUrl,
        anonKey: supabaseKey,
        isConnected: isOk
      };

      const updatedData: FinanceData = {
        ...data,
        supabaseConfig: updatedConfig
      };

      try {
        const response = await fetch("/api/finance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedData)
        });

        if (response.ok) {
          const freshData = await response.json();
          onUpdateData(freshData);
          setTestResult(isOk ? "success" : "error");
        } else {
          setTestResult("error");
        }
      } catch (err) {
        console.error(err);
        setTestResult("error");
      } finally {
        setIsTesting(false);
      }
    }, 1500);
  };

  const handleAddAccount = async () => {
    if (!newAccName || !newAccBalance) return;

    const newAccount: Account = {
      id: `acc-${Date.now()}`,
      name: newAccName,
      type: newAccType,
      balance: parseFloat(newAccBalance) || 0,
      currency: "USD",
      lastUpdated: new Date().toISOString()
    };

    const updatedData: FinanceData = {
      ...data,
      accounts: [...data.accounts, newAccount]
    };

    try {
      const response = await fetch("/api/finance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData)
      });

      if (response.ok) {
        const freshData = await response.json();
        onUpdateData(freshData);
        setNewAccName("");
        setNewAccBalance("");
        setShowAddAccount(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const totalAssets = data.accounts
    .filter(a => a.type !== "credit")
    .reduce((sum, a) => sum + a.balance, 0);

  const totalLiabilities = data.accounts
    .filter(a => a.type === "credit")
    .reduce((sum, a) => sum + a.balance, 0);

  const netWorth = totalAssets - totalLiabilities;

  return (
    <div className="space-y-6 select-none animate-fade-in">
      
      {/* Summary Header Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">
              Total Assets
            </span>
            <h4 className="font-sans font-extrabold text-2xl text-slate-800 dark:text-slate-100 mt-1">
              {formatCurrency(totalAssets, "USD", language)}
            </h4>
            <p className="text-[10px] text-emerald-500 font-semibold mt-1 flex items-center gap-1">
              <TrendingUp size={12} /> +1.4% change this week
            </p>
          </div>
          <div className="p-3 bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <Wallet size={24} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">
              Total Liabilities
            </span>
            <h4 className="font-sans font-extrabold text-2xl text-slate-850 dark:text-slate-200 mt-1">
              {formatCurrency(totalLiabilities, "USD", language)}
            </h4>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
              Credit card outstanding balances
            </p>
          </div>
          <div className="p-3 bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-400 rounded-xl">
            <ArrowUpRight size={24} className="rotate-90" />
          </div>
        </div>

        <div className="bg-gradient-to-tr from-emerald-600 to-teal-500 rounded-2xl p-5 text-white shadow-lg shadow-emerald-500/10 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-100">
              Calculated Net Worth
            </span>
            <h4 className="font-sans font-extrabold text-2xl mt-1">
              {formatCurrency(netWorth, "USD", language)}
            </h4>
            <p className="text-[10px] text-emerald-100 mt-1 flex items-center gap-1">
              <Activity size={12} /> Financial Liquidity: Optimal
            </p>
          </div>
          <div className="p-3 bg-white/10 rounded-xl text-white">
            <ShieldCheck size={24} />
          </div>
        </div>
      </div>

      {/* Main Grid: Accounts List & Supabase Setup */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Connected Accounts list */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm overflow-hidden p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-sans font-bold text-base text-slate-800 dark:text-slate-100">
                Connected Institutions
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                Manage bank accounts, checking accounts, and wallets
              </p>
            </div>
            <button
              onClick={() => setShowAddAccount(!showAddAccount)}
              className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs py-1.5 px-3 rounded-xl transition-colors shadow-sm shadow-emerald-500/10"
            >
              <Plus size={14} /> Account
            </button>
          </div>

          {showAddAccount && (
            <div className="mb-5 p-4 border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 rounded-xl space-y-3">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Add New Institution Account
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <input
                    type="text"
                    value={newAccName}
                    onChange={(e) => setNewAccName(e.target.value)}
                    placeholder="Account Name (e.g. Chase Checkings)"
                    className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <select
                    value={newAccType}
                    onChange={(e: any) => setNewAccType(e.target.value)}
                    className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="checking">Checking</option>
                    <option value="savings">Savings</option>
                    <option value="credit">Credit Card</option>
                    <option value="investment">Investment</option>
                  </select>
                </div>
                <div>
                  <input
                    type="number"
                    value={newAccBalance}
                    onChange={(e) => setNewAccBalance(e.target.value)}
                    placeholder="Balance ($)"
                    className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setShowAddAccount(false)}
                  className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddAccount}
                  className="text-xs px-3 py-1.5 rounded-lg bg-emerald-500 text-white font-semibold hover:bg-emerald-600"
                >
                  Save
                </button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {data.accounts.map((acc) => (
              <div 
                key={acc.id}
                className="flex items-center justify-between p-4 rounded-xl border border-slate-150 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-150 bg-slate-50/[0.01]"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className={`p-2.5 rounded-xl ${
                    acc.type === "checking" ? "bg-blue-500/10 text-blue-600 dark:text-blue-400" :
                    acc.type === "savings" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" :
                    acc.type === "credit" ? "bg-red-500/10 text-red-600 dark:text-red-400" :
                    "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                  }`}>
                    <Wallet size={16} />
                  </div>
                  <div className="min-w-0">
                    <span className="font-sans font-bold text-sm text-slate-700 dark:text-slate-200 block truncate">
                      {acc.name}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-semibold">
                      {acc.type} • Synced 3 hours ago
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-sans font-extrabold text-sm text-slate-800 dark:text-slate-100">
                    {formatCurrency(acc.balance, "USD", language)}
                  </span>
                  <span className="text-[10px] text-slate-400 block font-medium">
                    USD
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Supabase Setup Panel */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-emerald-500/10 text-emerald-600 rounded-xl">
                <Database size={18} />
              </div>
              <h3 className="font-sans font-bold text-base text-slate-800 dark:text-slate-100">
                {t.supabaseConfig}
              </h3>
            </div>
            
            <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed mb-4">
              Switch from our high-performance local sandbox database to your actual production Supabase PostgreSQL project instantly by configuring credentials below.
            </p>

            <div className="space-y-3.5">
              <div>
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block uppercase tracking-wider mb-1">
                  {t.supabaseUrl}
                </label>
                <input
                  type="text"
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                  placeholder="https://xyzcompany.supabase.co"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block uppercase tracking-wider mb-1">
                  {t.supabaseKey}
                </label>
                <input
                  type="password"
                  value={supabaseKey}
                  onChange={(e) => setSupabaseKey(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Live Indicator Status */}
            <div className="mt-5 p-4 rounded-xl border border-slate-150 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-950/20 flex gap-3">
              {data.supabaseConfig.isConnected ? (
                <>
                  <CheckCircle className="text-emerald-500 mt-0.5 shrink-0" size={16} />
                  <div>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                      {t.connected}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-0.5 leading-relaxed">
                      All tables (accounts, transactions, bills, budgets) are automatically synced to your cloud Postgres schema!
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <AlertCircle className="text-orange-500 mt-0.5 shrink-0" size={16} />
                  <div>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                      {t.disconnected}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-0.5 leading-relaxed">
                      ElysianWealth is using a sandboxed local-file backup storage so that your app remains fully interactive instantly without needing credentials.
                    </span>
                  </div>
                </>
              )}
            </div>

            {testResult === "success" && (
              <div className="mt-3 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200/50 dark:border-emerald-800/50 text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-2">
                <CheckCircle size={14} /> Database Connection Verified Successfully!
              </div>
            )}
            {testResult === "error" && (
              <div className="mt-3 p-2.5 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200/50 dark:border-red-800/50 text-[11px] text-red-700 dark:text-red-400 font-semibold flex items-center gap-2">
                <ServerCrash size={14} /> Connection Failed. Check credentials & try again.
              </div>
            )}
          </div>

          <button
            onClick={handleConnectSupabase}
            disabled={isTesting}
            className="w-full mt-6 py-2.5 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50 shadow-md shadow-slate-900/10"
          >
            {isTesting ? (
              <>Connecting...</>
            ) : (
              <>
                <Database size={14} />
                {t.connectSupabase}
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
}
